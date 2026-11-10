const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "hirehub_jwt_secret_dev", {
    expiresIn: "7d",
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  headline: user.headline || "",
  skills: user.skills || [],
  bio: user.bio || "",
  resumeUrl: user.resumeUrl || "",
  savedJobs: user.savedJobs || [],
  company: user.company || "",
  companyLogo: user.companyLogo || "",
  companyWebsite: user.companyWebsite || "",
  companySize: user.companySize || "",
  companyAbout: user.companyAbout || "",
});

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    if (role === "recruiter" && !company) {
      return res.status(400).json({ message: "Company name is required for recruiters." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: "Email is already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role: role === "recruiter" ? "recruiter" : "applicant",
      company: company ? company.trim() : "",
    });

    res.status(201).json({
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password." });

    res.json({
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(sanitizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const {
      name,
      headline,
      skills,
      bio,
      resumeUrl,
      company,
      companyLogo,
      companyWebsite,
      companySize,
      companyAbout,
    } = req.body;

    if (name) user.name = name.trim();
    if (headline !== undefined) user.headline = headline.trim();
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills.map((s) => s.trim()).filter(Boolean)
        : skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (bio !== undefined) user.bio = bio.trim();
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl.trim();
    if (company !== undefined) user.company = company.trim();
    if (companyLogo !== undefined) user.companyLogo = companyLogo.trim();
    if (companyWebsite !== undefined) user.companyWebsite = companyWebsite.trim();
    if (companySize !== undefined) user.companySize = companySize.trim();
    if (companyAbout !== undefined) user.companyAbout = companyAbout.trim();

    await user.save();
    res.json({
      message: "Profile updated successfully.",
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

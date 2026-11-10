const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

// GET /api/jobs (public, with pagination & advanced filters)
exports.getJobs = async (req, res) => {
  try {
    const { search, type, location, experienceLevel, status, page = 1, limit = 9 } = req.query;
    const filter = {};

    // By default, public search only shows Active jobs unless specified
    filter.status = status || "Active";

    if (search) {
      const cleanSearch = search.trim();
      filter.$or = [
        { title: { $regex: cleanSearch, $options: "i" } },
        { company: { $regex: cleanSearch, $options: "i" } },
        { skillsRequired: { $in: [new RegExp(cleanSearch, "i")] } },
      ];
    }

    if (type) filter.type = type;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) filter.location = { $regex: location.trim(), $options: "i" };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, jobs] = await Promise.all([
      Job.countDocuments(filter),
      Job.find(filter)
        .populate("postedBy", "name company companyLogo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    res.json({
      jobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/jobs/:id (public)
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("postedBy", "name email company companyLogo companyWebsite companySize companyAbout");

    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/jobs (recruiter only)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      experienceLevel,
      skillsRequired,
      salary,
      description,
      requirements,
      status,
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: "Title, company, location, and description are required." });
    }

    const skills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === "string"
      ? skillsRequired.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      type: type || "Full-time",
      experienceLevel: experienceLevel || "Mid Level",
      skillsRequired: skills,
      salary: salary ? salary.trim() : "",
      description: description.trim(),
      requirements: requirements ? requirements.trim() : "",
      status: status || "Active",
      postedBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/jobs/:id (recruiter who owns it)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own jobs." });
    }

    const {
      title,
      company,
      location,
      type,
      experienceLevel,
      skillsRequired,
      salary,
      description,
      requirements,
      status,
    } = req.body;

    if (title) job.title = title.trim();
    if (company) job.company = company.trim();
    if (location) job.location = location.trim();
    if (type) job.type = type;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (skillsRequired !== undefined) {
      job.skillsRequired = Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (salary !== undefined) job.salary = salary.trim();
    if (description) job.description = description.trim();
    if (requirements !== undefined) job.requirements = requirements.trim();
    if (status) job.status = status;

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/jobs/mine/list (recruiter only) - jobs with applicant counts
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 }).lean();
    for (const job of jobs) {
      job.applicantCount = await Application.countDocuments({ job: job._id });
    }
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/jobs/mine/stats (recruiter only) - analytics dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user.id }).select("_id status views");
    const jobIds = myJobs.map((j) => j._id);

    const totalJobs = myJobs.length;
    const activeJobs = myJobs.filter((j) => j.status === "Active").length;
    const totalViews = myJobs.reduce((acc, curr) => acc + (curr.views || 0), 0);

    const applications = await Application.find({ job: { $in: jobIds } }).select("status");
    const totalApplicants = applications.length;
    const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length;
    const underReviewCount = applications.filter((a) => a.status === "Under Review").length;
    const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

    res.json({
      totalJobs,
      activeJobs,
      totalViews,
      totalApplicants,
      shortlistedCount,
      underReviewCount,
      rejectedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/jobs/:id (recruiter who owns it)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own jobs." });
    }
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job and associated applications deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/jobs/:id/save (toggle bookmark for applicants)
exports.toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const jobId = req.params.id;
    const isSaved = user.savedJobs.some((id) => id.toString() === jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({
      saved: !isSaved,
      savedJobs: user.savedJobs,
      message: isSaved ? "Removed from saved jobs" : "Saved to your bookmarks",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/jobs/saved/list (get saved jobs for applicant)
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedJobs",
      populate: { path: "postedBy", select: "name company" },
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user.savedJobs || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

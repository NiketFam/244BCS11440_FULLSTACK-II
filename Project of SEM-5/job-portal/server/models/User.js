const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["applicant", "recruiter"], default: "applicant" },
    
    // Candidate Profile
    headline: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    bio: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    // Recruiter / Company Profile
    company: { type: String, trim: true, default: "" },
    companyLogo: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companySize: { type: String, default: "11-50 employees" },
    companyAbout: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

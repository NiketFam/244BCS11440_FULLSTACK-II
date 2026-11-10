const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Remote", "Contract"],
      default: "Full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["Entry Level", "Mid Level", "Senior Level", "Lead / Executive"],
      default: "Mid Level",
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    salary: { type: String, trim: true, default: "" },
    description: { type: String, required: true },
    requirements: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Paused", "Closed"],
      default: "Active",
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for fast searching
jobSchema.index({ title: "text", company: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);

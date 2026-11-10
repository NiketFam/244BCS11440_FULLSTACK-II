const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, required: true },
    resumeUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Shortlisted", "Rejected"],
      default: "Pending",
    },
    recruiterNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

// One applicant can apply to a job only once
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

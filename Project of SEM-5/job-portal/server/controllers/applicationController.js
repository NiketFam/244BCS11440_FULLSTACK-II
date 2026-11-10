const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications/:jobId (applicant only)
exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });

    if (job.status !== "Active") {
      return res.status(400).json({ message: "This job is no longer accepting applications." });
    }

    const { coverLetter, resumeLink } = req.body;
    if (!coverLetter) return res.status(400).json({ message: "Cover letter is required." });

    // Determine resume URL: if uploaded via multer (req.file) or passed as a link
    let finalResumeUrl = resumeLink ? resumeLink.trim() : "";
    if (req.file) {
      finalResumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user.id,
      coverLetter: coverLetter.trim(),
      resumeUrl: finalResumeUrl,
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job." });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications/mine (applicant only)
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user.id })
      .populate("job", "title company location type salary status")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications/job/:jobId (recruiter who owns the job)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "This is not your job posting." });
    }

    const apps = await Application.find({ job: job._id })
      .populate("applicant", "name email headline skills resumeUrl")
      .sort({ createdAt: -1 });

    res.json({ job, applications: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/applications/:id/status (recruiter who owns the job)
exports.updateStatus = async (req, res) => {
  try {
    const { status, recruiterNotes } = req.body;
    const validStatuses = ["Pending", "Under Review", "Shortlisted", "Rejected"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found." });
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed." });
    }

    if (status) application.status = status;
    if (recruiterNotes !== undefined) application.recruiterNotes = recruiterNotes.trim();

    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

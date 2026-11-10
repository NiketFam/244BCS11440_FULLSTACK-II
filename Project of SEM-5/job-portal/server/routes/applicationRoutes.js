const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateStatus,
} = require("../controllers/applicationController");
const { verifyToken, verifyRole } = require("../middleware/verifyToken");
const { uploadResume } = require("../middleware/upload");

const router = express.Router();

// Applicant routes
router.post(
  "/:jobId",
  verifyToken,
  verifyRole("applicant"),
  uploadResume.single("resume"),
  applyToJob
);
router.get("/mine", verifyToken, verifyRole("applicant"), getMyApplications);

// Recruiter routes
router.get("/job/:jobId", verifyToken, verifyRole("recruiter"), getJobApplications);
router.put("/:id/status", verifyToken, verifyRole("recruiter"), updateStatus);

module.exports = router;

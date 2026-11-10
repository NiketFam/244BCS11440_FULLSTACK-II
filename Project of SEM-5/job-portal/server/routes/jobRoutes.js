const express = require("express");
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getDashboardStats,
  toggleSaveJob,
  getSavedJobs,
} = require("../controllers/jobController");
const { verifyToken, verifyRole } = require("../middleware/verifyToken");

const router = express.Router();

// Public routes
router.get("/", getJobs);

// Recruiter routes (must come before /:id)
router.get("/mine/list", verifyToken, verifyRole("recruiter"), getMyJobs);
router.get("/mine/stats", verifyToken, verifyRole("recruiter"), getDashboardStats);

// Candidate saved jobs routes (must come before /:id)
router.get("/saved/list", verifyToken, verifyRole("applicant"), getSavedJobs);
router.post("/:id/save", verifyToken, verifyRole("applicant"), toggleSaveJob);

// Public single job
router.get("/:id", getJob);

// Recruiter actions
router.post("/", verifyToken, verifyRole("recruiter"), createJob);
router.put("/:id", verifyToken, verifyRole("recruiter"), updateJob);
router.delete("/:id", verifyToken, verifyRole("recruiter"), deleteJob);

module.exports = router;

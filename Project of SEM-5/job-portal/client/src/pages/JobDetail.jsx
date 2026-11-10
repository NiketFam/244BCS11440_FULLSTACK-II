import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  Eye,
  CheckCircle,
  Upload,
  Globe,
  Building,
  ArrowLeft,
  Users,
} from "lucide-react";

export default function JobDetail() {
  const { id } = useParams();
  const { user, toggleBookmark, isJobSaved } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [useProfileResume, setUseProfileResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch((err) => showToast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [id, showToast]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      showToast("Please provide a cover letter.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      } else if (useProfileResume && user?.resumeUrl) {
        formData.append("resumeLink", user.resumeUrl);
      } else if (resumeLink) {
        formData.append("resumeLink", resumeLink);
      }

      await api.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplied(true);
      showToast("Application submitted successfully!", "success");
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      showToast("Please log in to bookmark jobs.", "info");
      return;
    }
    const res = await toggleBookmark(job._id);
    if (res.success) showToast(res.message, "success");
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div className="card skeleton" style={{ height: 350, marginBottom: "1rem" }} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="card text-center" style={{ padding: "3rem" }}>
        <h2>Job posting not found</h2>
        <p className="muted">This role may have been removed or expired.</p>
        <Link to="/" className="btn btn-outline" style={{ marginTop: "1rem" }}>
          Back to all jobs
        </Link>
      </div>
    );
  }

  const saved = isJobSaved(job._id);
  const isRecruiterOwner = user?.role === "recruiter" && (job.postedBy?._id === user.id || job.postedBy === user.id);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <Link to="/" className="btn btn-ghost btn-sm" style={{ marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Back to Search
      </Link>

      {/* Top Header Card */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="flex-between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <div className="company-avatar" style={{ width: 64, height: 64, fontSize: "1.6rem" }}>
              {job.company ? job.company.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <h1 style={{ marginBottom: "0.25rem" }}>{job.title}</h1>
              <div className="job-info-meta">
                <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: "1rem" }}>
                  {job.company}
                </span>
                <span>
                  <MapPin size={16} /> {job.location}
                </span>
                {job.salary && (
                  <span>
                    <DollarSign size={16} /> {job.salary}
                  </span>
                )}
                <span>
                  <Eye size={16} /> {job.views || 1} views
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {user?.role === "applicant" && (
              <button
                className={`btn btn-icon ${saved ? "btn-outline" : "btn-ghost"}`}
                onClick={handleBookmarkToggle}
                title={saved ? "Saved" : "Save Job"}
                style={saved ? { color: "var(--brand)", borderColor: "var(--brand)" } : {}}
              >
                <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
              </button>
            )}

            {isRecruiterOwner && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link to={`/jobs/${job._id}/applicants`} className="btn btn-sm">
                  <Users size={16} /> View Applicants
                </Link>
                <Link to={`/jobs/${job._id}/edit`} className="btn btn-sm btn-outline">
                  Edit Job
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="tag-list" style={{ marginTop: "1.25rem" }}>
          <span className="badge badge-blue">{job.type}</span>
          {job.experienceLevel && <span className="badge badge-purple">{job.experienceLevel}</span>}
          <span className={`badge ${job.status === "Active" ? "badge-green" : "badge-red"}`}>
            {job.status}
          </span>
          {job.skillsRequired?.map((skill, idx) => (
            <span key={idx} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "1.5rem" }}>
        {/* Left Column: Job Description & Company Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card">
            <h3>About the Role</h3>
            <p className="pre-wrap" style={{ color: "var(--ink)" }}>{job.description}</p>

            {job.requirements && (
              <>
                <h3 style={{ marginTop: "1.5rem" }}>Key Requirements</h3>
                <p className="pre-wrap" style={{ color: "var(--ink)" }}>{job.requirements}</p>
              </>
            )}
          </div>

          {job.postedBy?.company && (
            <div className="card">
              <h3>About {job.company}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.5rem" }}>
                {job.postedBy.companyWebsite && (
                  <p className="muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
                    <Globe size={16} />
                    <a href={job.postedBy.companyWebsite} target="_blank" rel="noreferrer">
                      {job.postedBy.companyWebsite}
                    </a>
                  </p>
                )}
                {job.postedBy.companySize && (
                  <p className="muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
                    <Building size={16} /> {job.postedBy.companySize}
                  </p>
                )}
                {job.postedBy.companyAbout && (
                  <p style={{ marginTop: "0.5rem" }}>{job.postedBy.companyAbout}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Application Box */}
        <div>
          <div className="card" style={{ position: "sticky", top: "85px" }}>
            {applied ? (
              <div className="text-center" style={{ padding: "2rem 1rem" }}>
                <CheckCircle size={48} color="var(--success)" style={{ margin: "0 auto 1rem" }} />
                <h3>Application Submitted!</h3>
                <p className="muted" style={{ fontSize: "0.92rem", marginBottom: "1.5rem" }}>
                  The hiring team has received your application. You can monitor progress under your dashboard.
                </p>
                <Link to="/my-applications" className="btn btn-outline btn-sm">
                  View My Applications
                </Link>
              </div>
            ) : !user ? (
              <div className="text-center" style={{ padding: "2rem 1rem" }}>
                <Briefcase size={40} className="muted" style={{ margin: "0 auto 1rem" }} />
                <h3>Interested in this role?</h3>
                <p className="muted" style={{ fontSize: "0.92rem", marginBottom: "1.5rem" }}>
                  Sign in or create a candidate account to apply directly with your resume.
                </p>
                <Link to="/login" className="btn" style={{ width: "100%" }}>
                  Log In to Apply
                </Link>
              </div>
            ) : user.role === "recruiter" ? (
              <div style={{ padding: "1rem" }}>
                <h3>Recruiter View</h3>
                <p className="muted" style={{ fontSize: "0.92rem" }}>
                  You are logged in with a recruiter account. Recruiters manage postings and screen applicant submissions.
                </p>
                <Link to="/dashboard" className="btn btn-outline" style={{ width: "100%", marginTop: "1rem" }}>
                  Go to Dashboard
                </Link>
              </div>
            ) : job.status !== "Active" ? (
              <div style={{ padding: "1rem" }}>
                <span className="badge badge-red" style={{ marginBottom: "0.75rem" }}>
                  Position Closed
                </span>
                <p className="muted" style={{ fontSize: "0.92rem" }}>
                  This position is currently not accepting new applications.
                </p>
              </div>
            ) : (
              <form className="form" onSubmit={handleApply}>
                <h3 style={{ margin: 0 }}>Apply Now</h3>
                <p className="muted" style={{ fontSize: "0.88rem", margin: 0 }}>
                  Applying for <strong>{job.title}</strong> at <strong>{job.company}</strong>
                </p>

                <div className="form-group">
                  <label>Cover Letter / Pitch *</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly introduce yourself and why you're a great fit for this role..."
                    required
                  />
                </div>

                {user.resumeUrl && (
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={useProfileResume}
                      onChange={(e) => {
                        setUseProfileResume(e.target.checked);
                        if (e.target.checked) setResumeFile(null);
                      }}
                      style={{ width: "auto" }}
                    />
                    Use resume saved in my profile
                  </label>
                )}

                {!useProfileResume && (
                  <div className="form-group">
                    <label>Upload PDF Resume (Recommended)</label>
                    <div
                      style={{
                        border: "1px dashed var(--border)",
                        borderRadius: "8px",
                        padding: "1rem",
                        textAlign: "center",
                        background: "var(--surface-hover)",
                      }}
                    >
                      <Upload size={24} className="muted" style={{ margin: "0 auto 0.5rem" }} />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        style={{ display: "none" }}
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="btn btn-sm btn-outline" style={{ cursor: "pointer" }}>
                        Choose File
                      </label>
                      <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.5rem", margin: 0 }}>
                        {resumeFile ? `Selected: ${resumeFile.name}` : "PDF or Word docs up to 5MB"}
                      </p>
                    </div>
                  </div>
                )}

                {!useProfileResume && !resumeFile && (
                  <div className="form-group">
                    <label>Or External Resume Link</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or LinkedIn"
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                    />
                  </div>
                )}

                <button type="submit" className="btn" disabled={submitting} style={{ width: "100%", marginTop: "0.5rem" }}>
                  {submitting ? "Sending..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

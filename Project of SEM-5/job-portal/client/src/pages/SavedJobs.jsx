import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Bookmark,
  MapPin,
  DollarSign,
  ArrowRight,
  Briefcase,
  Trash2,
} from "lucide-react";

export default function SavedJobs() {
  const { toggleBookmark } = useAuth();
  const { showToast } = useToast();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs/saved/list");
      setSavedJobs(data || []);
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []); // eslint-disable-line

  const handleRemove = async (jobId) => {
    const res = await toggleBookmark(jobId);
    if (res.success) {
      setSavedJobs(savedJobs.filter((j) => j._id !== jobId));
      showToast("Removed from saved jobs.", "success");
    } else {
      showToast(res.message, "error");
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="card skeleton" style={{ height: 300 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1>Saved Job Openings</h1>
          <p className="muted" style={{ margin: 0 }}>
            Roles you have bookmarked to review or apply to later.
          </p>
        </div>
        <Link to="/" className="btn btn-outline btn-sm">
          Browse More Jobs
        </Link>
      </div>

      {savedJobs.length === 0 ? (
        <div className="card text-center" style={{ padding: "3.5rem 1rem" }}>
          <Bookmark size={44} className="muted" style={{ margin: "0 auto 1rem" }} />
          <h2>No saved jobs yet</h2>
          <p className="muted" style={{ maxWidth: 420, margin: "0 auto 1.5rem" }}>
            Click the bookmark icon on any job card to save it here for quick access later.
          </p>
          <Link to="/" className="btn">
            Explore Open Positions
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {savedJobs.map((job) => (
            <div key={job._id} className="card job-item">
              <div className="job-item-left">
                <div className="company-avatar">
                  {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                </div>
                <div className="job-info">
                  <h2>{job.title}</h2>
                  <div className="job-info-meta">
                    <span style={{ fontWeight: 600, color: "var(--ink)" }}>{job.company}</span>
                    <span>
                      <MapPin size={15} /> {job.location}
                    </span>
                    {job.salary && (
                      <span>
                        <DollarSign size={15} /> {job.salary}
                      </span>
                    )}
                  </div>

                  <div className="tag-list">
                    <span className="badge badge-blue">{job.type}</span>
                    {job.experienceLevel && (
                      <span className="badge badge-purple">{job.experienceLevel}</span>
                    )}
                    {job.skillsRequired?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleRemove(job._id)}
                  title="Remove bookmark"
                >
                  <Trash2 size={16} />
                </button>
                <Link to={`/jobs/${job._id}`} className="btn btn-sm">
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

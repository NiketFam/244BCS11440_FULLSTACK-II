import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useToast } from "../context/ToastContext";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Eye,
  PlusCircle,
  Trash2,
  Edit3,
  MapPin,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get("/jobs/mine/list"),
        api.get("/jobs/mine/stats"),
      ]);
      setJobs(jobsRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? All applicants for this job will also be removed.`)) {
      return;
    }
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id));
      showToast("Job posting deleted.", "success");
      // refresh stats
      api.get("/jobs/mine/stats").then(({ data }) => setStats(data));
    } catch (err) {
      showToast(errorMessage(err), "error");
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const { data } = await api.put(`/jobs/${jobId}`, { status: newStatus });
      setJobs(jobs.map((j) => (j._id === jobId ? { ...j, status: data.status } : j)));
      showToast(`Status updated to ${newStatus}`, "success");
      api.get("/jobs/mine/stats").then(({ data }) => setStats(data));
    } catch (err) {
      showToast(errorMessage(err), "error");
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (filterStatus === "All") return true;
    return j.status === filterStatus;
  });

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1>Recruiter Dashboard</h1>
          <p className="muted" style={{ margin: 0 }}>
            Manage active openings, track incoming talent, and review metrics.
          </p>
        </div>
        <Link to="/post-job" className="btn">
          <PlusCircle size={18} /> Post New Job
        </Link>
      </div>

      {/* Analytics Stats Grid */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Briefcase size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.totalJobs}</div>
              <div className="stat-label">Total Postings ({stats.activeJobs} Active)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Users size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.totalApplicants}</div>
              <div className="stat-label">Total Applicants</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.shortlistedCount}</div>
              <div className="stat-label">Shortlisted Candidates</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon amber">
              <Eye size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.totalViews}</div>
              <div className="stat-label">Candidate Views</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {["All", "Active", "Paused", "Closed"].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filterStatus === s ? "btn-outline" : "btn-ghost"}`}
            onClick={() => setFilterStatus(s)}
            style={filterStatus === s ? { borderColor: "var(--brand)", color: "var(--brand)" } : {}}
          >
            {s} ({s === "All" ? jobs.length : jobs.filter((j) => j.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="card skeleton skeleton-card" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="card text-center" style={{ padding: "3rem 1rem" }}>
          <Briefcase size={40} className="muted" style={{ margin: "0 auto 1rem" }} />
          <h2>No jobs found</h2>
          <p className="muted" style={{ maxWidth: 400, margin: "0 auto 1.5rem" }}>
            {filterStatus === "All"
              ? "You haven't posted any jobs yet. Create your first opening to start receiving applicants."
              : `No jobs currently marked as ${filterStatus}.`}
          </p>
          <Link to="/post-job" className="btn">
            Create a Job Opening
          </Link>
        </div>
      ) : (
        <div>
          {filteredJobs.map((job) => (
            <div key={job._id} className="card job-item">
              <div className="job-item-left">
                <div className="company-avatar">
                  {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                </div>
                <div className="job-info">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <h2>{job.title}</h2>
                    <span
                      className={`badge ${
                        job.status === "Active"
                          ? "badge-green"
                          : job.status === "Paused"
                          ? "badge-amber"
                          : "badge-red"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="job-info-meta">
                    <span>
                      <MapPin size={15} /> {job.location}
                    </span>
                    <span>
                      <Users size={15} /> <strong>{job.applicantCount || 0}</strong> applicant
                      {job.applicantCount === 1 ? "" : "s"}
                    </span>
                    <span>
                      <Eye size={15} /> {job.views || 0} views
                    </span>
                    <span>
                      <Clock size={15} /> {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job._id, e.target.value)}
                  style={{ width: "auto", fontSize: "0.85rem", padding: "0.35rem 0.6rem" }}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Closed">Closed</option>
                </select>

                <Link to={`/jobs/${job._id}/applicants`} className="btn btn-sm">
                  <Users size={15} /> Applicants ({job.applicantCount || 0})
                </Link>

                <Link to={`/jobs/${job._id}/edit`} className="btn btn-sm btn-outline">
                  <Edit3 size={15} /> Edit
                </Link>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(job._id, job.title)}
                  title="Delete Job"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

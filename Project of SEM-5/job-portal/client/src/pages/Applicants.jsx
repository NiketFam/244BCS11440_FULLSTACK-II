import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { errorMessage, getAssetUrl } from "../api";
import { useToast } from "../context/ToastContext";
import {
  ArrowLeft,
  FileText,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Search,
} from "lucide-react";

export default function Applicants() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingNotes, setEditingNotes] = useState({});

  useEffect(() => {
    api
      .get(`/applications/job/${id}`)
      .then(({ data }) => {
        setJob(data.job || null);
        setApps(data.applications || []);
      })
      .catch((err) => showToast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [id, showToast]);

  const setStatus = async (appId, newStatus) => {
    try {
      const { data } = await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApps(apps.map((a) => (a._id === appId ? { ...a, status: data.status } : a)));
      showToast(`Applicant status marked as ${newStatus}`, "success");
    } catch (err) {
      showToast(errorMessage(err), "error");
    }
  };

  const handleSaveNotes = async (appId) => {
    const notes = editingNotes[appId];
    try {
      const { data } = await api.put(`/applications/${appId}/status`, { recruiterNotes: notes });
      setApps(apps.map((a) => (a._id === appId ? { ...a, recruiterNotes: data.recruiterNotes } : a)));
      showToast("Notes saved.", "success");
    } catch (err) {
      showToast(errorMessage(err), "error");
    }
  };

  const filteredApps = apps.filter((a) => {
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    const matchesSearch =
      !search ||
      a.applicant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant?.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant?.headline?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="card skeleton" style={{ height: 300 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="flex-between" style={{ marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1>Applicants: {job?.title || "Job"}</h1>
          <p className="muted" style={{ margin: 0 }}>
            Review candidates who submitted applications for <strong>{job?.title}</strong>.
          </p>
        </div>
        <span className="badge badge-blue" style={{ fontSize: "0.9rem", padding: "0.35rem 0.85rem" }}>
          {apps.length} Total Candidate{apps.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: "1.5rem", padding: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {["All", "Pending", "Under Review", "Shortlisted", "Rejected"].map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${statusFilter === s ? "btn-outline" : "btn-ghost"}`}
                onClick={() => setStatusFilter(s)}
                style={statusFilter === s ? { borderColor: "var(--brand)", color: "var(--brand)" } : {}}
              >
                {s} ({s === "All" ? apps.length : apps.filter((a) => a.status === s).length})
              </button>
            ))}
          </div>

          <div className="input-with-icon" style={{ minWidth: 260 }}>
            <Search size={16} />
            <input
              placeholder="Search candidate name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "0.45rem 0.65rem 0.45rem 2.2rem", fontSize: "0.88rem" }}
            />
          </div>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="card text-center" style={{ padding: "3rem" }}>
          <FileText size={44} className="muted" style={{ margin: "0 auto 1rem" }} />
          <h2>No applicants match the current filter</h2>
          <p className="muted">Try switching status tabs or clearing search keywords.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {filteredApps.map((a) => {
            const resumeLink = a.resumeUrl ? getAssetUrl(a.resumeUrl) : "";
            const currentNotes = editingNotes[a._id] !== undefined ? editingNotes[a._id] : (a.recruiterNotes || "");

            const statusBadgeClass =
              a.status === "Shortlisted"
                ? "badge-green"
                : a.status === "Under Review"
                ? "badge-amber"
                : a.status === "Rejected"
                ? "badge-red"
                : "badge-blue";

            return (
              <div key={a._id} className="card">
                <div className="flex-between" style={{ alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                    <div className="company-avatar" style={{ width: 44, height: 44, fontSize: "1.1rem" }}>
                      {a.applicant?.name ? a.applicant.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{a.applicant?.name}</h2>
                      <p className="muted" style={{ margin: 0, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Mail size={14} /> {a.applicant?.email}
                        {a.applicant?.headline && (
                          <span>• {a.applicant.headline}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <span className={`badge ${statusBadgeClass}`} style={{ fontSize: "0.85rem" }}>
                    {a.status}
                  </span>
                </div>

                {a.applicant?.skills?.length > 0 && (
                  <div className="tag-list" style={{ marginBottom: "0.75rem" }}>
                    {a.applicant.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ background: "var(--surface-hover)", padding: "0.85rem 1rem", borderRadius: "8px", margin: "0.75rem 0" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                    Candidate Pitch / Cover Letter:
                  </span>
                  <p className="pre-wrap" style={{ margin: "0.35rem 0 0", fontSize: "0.92rem" }}>
                    {a.coverLetter}
                  </p>
                </div>

                <div className="flex-between" style={{ flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
                  {resumeLink ? (
                    <a
                      href={resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline"
                      style={{ color: "var(--brand)", borderColor: "var(--brand)" }}
                    >
                      <FileText size={16} /> Open Candidate Resume (PDF) <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="muted" style={{ fontSize: "0.85rem" }}>
                      No resume file provided
                    </span>
                  )}

                  {/* Status Actions */}
                  <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => setStatus(a._id, "Shortlisted")}
                      disabled={a.status === "Shortlisted"}
                    >
                      <CheckCircle size={15} /> Shortlist
                    </button>

                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setStatus(a._id, "Under Review")}
                      disabled={a.status === "Under Review"}
                    >
                      <Clock size={15} /> Under Review
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setStatus(a._id, "Rejected")}
                      disabled={a.status === "Rejected"}
                    >
                      <XCircle size={15} /> Reject
                    </button>

                    {a.status !== "Pending" && (
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setStatus(a._id, "Pending")}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Recruiter Private Notes */}
                <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <MessageSquare size={15} className="muted" />
                    <input
                      placeholder="Private interviewer note / feedback on candidate..."
                      value={currentNotes}
                      onChange={(e) => setEditingNotes({ ...editingNotes, [a._id]: e.target.value })}
                      style={{ fontSize: "0.85rem", padding: "0.4rem 0.65rem" }}
                    />
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleSaveNotes(a._id)}
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

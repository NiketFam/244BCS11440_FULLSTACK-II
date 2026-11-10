import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage, getAssetUrl } from "../api";
import { useToast } from "../context/ToastContext";
import {
  Briefcase,
  MapPin,
  Clock,
  ExternalLink,
  FileText,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export default function MyApplications() {
  const { showToast } = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    api
      .get("/applications/mine")
      .then(({ data }) => setApps(data || []))
      .catch((err) => showToast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filteredApps = apps.filter((a) => {
    if (statusFilter === "All") return true;
    return a.status === statusFilter;
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
      <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1>My Job Applications</h1>
          <p className="muted" style={{ margin: 0 }}>
            Track the status of all positions you have applied to.
          </p>
        </div>
        <Link to="/" className="btn btn-outline btn-sm">
          Browse More Jobs
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
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

      {filteredApps.length === 0 ? (
        <div className="card text-center" style={{ padding: "3.5rem 1rem" }}>
          <Briefcase size={44} className="muted" style={{ margin: "0 auto 1rem" }} />
          <h2>No applications found</h2>
          <p className="muted" style={{ maxWidth: 420, margin: "0 auto 1.5rem" }}>
            {statusFilter === "All"
              ? "You haven't submitted any job applications yet. Search open roles and apply today!"
              : `No applications currently marked as ${statusFilter}.`}
          </p>
          <Link to="/" className="btn">
            Browse Verified Openings
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredApps.map((a) => {
            const statusBadgeClass =
              a.status === "Shortlisted"
                ? "badge-green"
                : a.status === "Under Review"
                ? "badge-amber"
                : a.status === "Rejected"
                ? "badge-red"
                : "badge-blue";

            const resumeLink = a.resumeUrl ? getAssetUrl(a.resumeUrl) : "";

            return (
              <div key={a._id} className="card job-item">
                <div className="job-item-left">
                  <div className="company-avatar">
                    {a.job?.company ? a.job.company.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div className="job-info">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <h2>{a.job?.title || "Job Unavailable"}</h2>
                      <span className={`badge ${statusBadgeClass}`}>{a.status}</span>
                    </div>

                    <div className="job-info-meta">
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{a.job?.company}</span>
                      {a.job?.location && (
                        <span>
                          <MapPin size={15} /> {a.job.location}
                        </span>
                      )}
                      {a.job?.salary && (
                        <span>
                          <DollarSign size={15} /> {a.job.salary}
                        </span>
                      )}
                      <span>
                        <Clock size={15} /> Applied on {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      {resumeLink && (
                        <a
                          href={resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="muted"
                          style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <FileText size={14} /> View Attached Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  {a.job?._id ? (
                    <Link to={`/jobs/${a.job._id}`} className="btn btn-sm btn-outline">
                      View Job <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="muted" style={{ fontSize: "0.85rem" }}>
                      Posting Expired
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

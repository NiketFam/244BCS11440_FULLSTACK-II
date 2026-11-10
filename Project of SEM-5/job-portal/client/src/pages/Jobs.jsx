import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  FilterX,
} from "lucide-react";

export default function Jobs() {
  const { user, toggleBookmark, isJobSaved } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 9 });
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    experienceLevel: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(
    async (pageToLoad = 1, currentFilters = filters) => {
      setLoading(true);
      try {
        const params = {
          page: pageToLoad,
          limit: 9,
          ...currentFilters,
        };
        // Clean out empty string filters
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key];
        });

        const { data } = await api.get("/jobs", { params });
        setJobs(data.jobs || []);
        setPagination(data.pagination || { total: 0, page: 1, pages: 1, limit: 9 });
      } catch (err) {
        showToast(errorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    },
    [filters, showToast]
  );

  useEffect(() => {
    fetchJobs(1);
  }, []); // eslint-disable-line

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(1, filters);
  };

  const handleClearFilters = () => {
    const emptyFilters = { search: "", location: "", type: "", experienceLevel: "" };
    setFilters(emptyFilters);
    fetchJobs(1, emptyFilters);
  };

  const handleBookmarkClick = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast("Please log in to save jobs.", "info");
      return;
    }
    const res = await toggleBookmark(jobId);
    if (res.success) {
      showToast(res.message, "success");
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <>
      <div className="hero">
        <h1>Discover Your Next Career Opportunity</h1>
        <p>Explore verified openings from top startups and tech companies.</p>
      </div>

      <form className="search-box" onSubmit={handleSearchSubmit}>
        <div className="search-grid">
          <div className="input-with-icon">
            <Search size={18} />
            <input
              name="search"
              placeholder="Title, company, or skills (e.g. React)..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="input-with-icon">
            <MapPin size={18} />
            <input
              name="location"
              placeholder="City, Country, or Remote..."
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="input-with-icon">
            <Briefcase size={18} />
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="input-with-icon">
            <Sparkles size={18} />
            <select
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Lead / Executive">Lead / Executive</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="btn">
              Search
            </button>
            {(filters.search || filters.location || filters.type || filters.experienceLevel) && (
              <button
                type="button"
                className="btn btn-outline btn-icon"
                onClick={handleClearFilters}
                title="Reset filters"
              >
                <FilterX size={18} />
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
        <p className="muted" style={{ margin: 0, fontWeight: 500, fontSize: "0.95rem" }}>
          Showing <strong>{jobs.length}</strong> of <strong>{pagination.total}</strong> active jobs
        </p>
      </div>

      {loading ? (
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card skeleton skeleton-card" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center" style={{ padding: "3.5rem 1rem" }}>
          <Building2 size={48} className="muted" style={{ margin: "0 auto 1rem" }} />
          <h2>No matching jobs found</h2>
          <p className="muted" style={{ maxWidth: 440, margin: "0 auto 1.5rem" }}>
            Try broadening your search keywords, clearing location filters, or resetting filters.
          </p>
          <button className="btn btn-outline" onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div>
          {jobs.map((job) => {
            const saved = isJobSaved(job._id);
            return (
              <Link
                to={`/jobs/${job._id}`}
                key={job._id}
                className="card card-interactive job-item"
              >
                <div className="job-item-left">
                  <div className="company-avatar">
                    {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div className="job-info">
                    <h2>{job.title}</h2>
                    <div className="job-info-meta">
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{job.company}</span>
                      <span>
                        <MapPin size={15} />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span>
                          <DollarSign size={15} />
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <div className="tag-list">
                      <span className="badge badge-blue">{job.type}</span>
                      {job.experienceLevel && (
                        <span className="badge badge-purple">{job.experienceLevel}</span>
                      )}
                      {job.skillsRequired?.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired?.length > 4 && (
                        <span className="skill-tag muted">
                          +{job.skillsRequired.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {user?.role === "applicant" && (
                    <button
                      className={`btn btn-icon ${saved ? "btn-outline" : "btn-ghost"}`}
                      onClick={(e) => handleBookmarkClick(e, job._id)}
                      title={saved ? "Saved" : "Save Job"}
                      style={saved ? { color: "var(--brand)", borderColor: "var(--brand)" } : {}}
                    >
                      <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
                    </button>
                  )}
                  <span className="btn btn-sm btn-outline">View Details</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={pagination.page <= 1}
            onClick={() => fetchJobs(pagination.page - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`page-btn ${num === pagination.page ? "active" : ""}`}
              onClick={() => fetchJobs(num)}
            >
              {num}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchJobs(pagination.page + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </>
  );
}

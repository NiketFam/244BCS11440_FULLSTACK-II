import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ArrowLeft, Save, Briefcase } from "lucide-react";

export default function PostJob() {
  const { id } = useParams(); // If present, we are in Edit mode
  const isEdit = Boolean(id);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    company: user?.company || "",
    location: "",
    type: "Full-time",
    experienceLevel: "Mid Level",
    skillsRequired: "",
    salary: "",
    description: "",
    requirements: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api
        .get(`/jobs/${id}`)
        .then(({ data }) => {
          setForm({
            title: data.title || "",
            company: data.company || "",
            location: data.location || "",
            type: data.type || "Full-time",
            experienceLevel: data.experienceLevel || "Mid Level",
            skillsRequired: Array.isArray(data.skillsRequired)
              ? data.skillsRequired.join(", ")
              : "",
            salary: data.salary || "",
            description: data.description || "",
            requirements: data.requirements || "",
            status: data.status || "Active",
          });
        })
        .catch((err) => showToast(errorMessage(err), "error"))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, showToast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
        showToast("Job updated successfully!", "success");
      } else {
        await api.post("/jobs", payload);
        showToast("Job published successfully!", "success");
      }

      navigate("/dashboard");
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ maxWidth: 700, margin: "2rem auto" }}>
        <div className="card skeleton" style={{ height: 400 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 740, margin: "0 auto" }}>
      <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <form className="card form" onSubmit={handleSubmit}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <Briefcase size={26} color="var(--brand)" />
          <h1 style={{ margin: 0 }}>{isEdit ? "Edit Job Posting" : "Create New Job Opening"}</h1>
        </div>
        <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
          {isEdit
            ? "Update the details and status of this opening."
            : "Fill in the details below to publish your opening to verified job seekers."}
        </p>

        <div className="form-row">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              name="title"
              placeholder="e.g. Senior Full Stack Engineer"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Company Name *</label>
            <input
              name="company"
              placeholder="e.g. Acme Technologies"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              name="location"
              placeholder="e.g. San Francisco, CA or Remote"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Salary Range (Optional)</label>
            <input
              name="salary"
              placeholder="e.g. $120,000 - $150,000 / yr"
              value={form.salary}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Employment Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Remote</option>
              <option>Contract</option>
            </select>
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
            >
              <option>Entry Level</option>
              <option>Mid Level</option>
              <option>Senior Level</option>
              <option>Lead / Executive</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Required Skills (comma-separated)</label>
          <input
            name="skillsRequired"
            placeholder="React, Node.js, TypeScript, MongoDB, Docker"
            value={form.skillsRequired}
            onChange={handleChange}
          />
        </div>

        {isEdit && (
          <div className="form-group">
            <label>Job Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active (Accepting applications)</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Role Description *</label>
          <textarea
            name="description"
            rows={6}
            placeholder="Provide a comprehensive summary of the team, mission, and day-to-day responsibilities..."
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Requirements & Qualifications (Optional)</label>
          <textarea
            name="requirements"
            rows={4}
            placeholder="• 3+ years experience with React and Node.js&#10;• Experience with REST APIs and MongoDB&#10;• Excellent problem-solving skills"
            value={form.requirements}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <Link to="/dashboard" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn" disabled={loading}>
            <Save size={16} /> {loading ? "Saving..." : isEdit ? "Update Job" : "Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock, Building, ArrowRight, UserPlus } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.role === "recruiter" && !form.company.trim()) {
      showToast("Company name is required for recruiters.", "error");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.token, data.user);
      showToast("Account created successfully! Welcome to HireHub.", "success");
      navigate(data.user.role === "recruiter" ? "/dashboard" : "/");
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="narrow-form">
      <form className="card form" onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "12px",
              background: "var(--brand-soft)",
              color: "var(--brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.75rem",
            }}
          >
            <UserPlus size={26} />
          </div>
          <h1>Join HireHub</h1>
          <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
            Choose your account role to get started today.
          </p>
        </div>

        {/* Account Role Tabs */}
        <div className="form-group">
          <label>I want to</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              className={`btn ${form.role === "applicant" ? "" : "btn-outline"}`}
              onClick={() => setForm({ ...form, role: "applicant" })}
              style={{ fontSize: "0.88rem" }}
            >
              Find a Job (Candidate)
            </button>
            <button
              type="button"
              className={`btn ${form.role === "recruiter" ? "" : "btn-outline"}`}
              onClick={() => setForm({ ...form, role: "recruiter" })}
              style={{ fontSize: "0.88rem" }}
            >
              Hire Talent (Recruiter)
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <div className="input-with-icon">
            <User size={18} />
            <input
              name="name"
              placeholder="e.g. Alex Johnson"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Work or Personal Email</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password (min. 6 characters)</label>
          <div className="input-with-icon">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              minLength={6}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {form.role === "recruiter" && (
          <div className="form-group">
            <label>Company / Organization Name</label>
            <div className="input-with-icon">
              <Building size={18} />
              <input
                name="company"
                placeholder="e.g. Acme Corp"
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <button type="submit" className="btn" disabled={loading} style={{ marginTop: "0.5rem" }}>
          {loading ? "Creating Account..." : "Create Account"} <ArrowRight size={16} />
        </button>

        <p className="muted text-center" style={{ fontSize: "0.9rem", margin: "0.5rem 0 0" }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

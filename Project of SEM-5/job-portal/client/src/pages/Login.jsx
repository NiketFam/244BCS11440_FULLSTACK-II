import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Lock, Mail, LogIn, ArrowRight } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}!`, "success");
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
            <LogIn size={26} />
          </div>
          <h1>Welcome Back</h1>
          <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
            Sign in to manage your jobs, applications, and bookmarks.
          </p>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-with-icon">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading} style={{ marginTop: "0.5rem" }}>
          {loading ? "Signing in..." : "Sign In"} <ArrowRight size={16} />
        </button>

        <p className="muted text-center" style={{ fontSize: "0.9rem", margin: "0.5rem 0 0" }}>
          Don't have an account yet? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

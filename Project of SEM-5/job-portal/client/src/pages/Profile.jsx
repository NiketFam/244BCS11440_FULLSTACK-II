import { useState } from "react";
import api, { errorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Building, Save, Sparkles, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    skills: user?.skills ? user.skills.join(", ") : "",
    bio: user?.bio || "",
    resumeUrl: user?.resumeUrl || "",
    company: user?.company || "",
    companyWebsite: user?.companyWebsite || "",
    companySize: user?.companySize || "11-50 employees",
    companyAbout: user?.companyAbout || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const { data } = await api.put("/auth/profile", payload);
      updateUser(data.user);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const isApplicant = user?.role === "applicant";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="card form" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.5rem" }}>
          {isApplicant ? <User size={28} color="var(--brand)" /> : <Building size={28} color="var(--brand)" />}
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem" }}>
              {isApplicant ? "Candidate Profile" : "Company Profile"}
            </h1>
            <p className="muted" style={{ margin: 0, fontSize: "0.88rem" }}>
              {isApplicant
                ? "Enhance your profile to auto-fill job applications and stand out to recruiters."
                : "Manage your organization information displayed on your job postings."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form" style={{ marginTop: "1rem" }}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input value={user?.email || ""} disabled style={{ background: "var(--surface-hover)" }} />
            </div>
          </div>

          {isApplicant ? (
            <>
              <div className="form-group">
                <label>Professional Headline</label>
                <input
                  name="headline"
                  placeholder="e.g. Full-Stack Engineer | React, Node.js, Cloud"
                  value={form.headline}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Skills & Technologies (comma-separated)</label>
                <input
                  name="skills"
                  placeholder="React, TypeScript, Node.js, MongoDB, AWS, Python"
                  value={form.skills}
                  onChange={handleChange}
                />
                {form.skills && (
                  <div className="tag-list" style={{ marginTop: "0.4rem" }}>
                    {form.skills
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Short Bio / About You</label>
                <textarea
                  name="bio"
                  rows={4}
                  placeholder="Tell recruiters about your background, projects, and career goals..."
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Default Resume Link (Google Drive / Dropbox / Portfolio)</label>
                <input
                  name="resumeUrl"
                  type="url"
                  placeholder="https://..."
                  value={form.resumeUrl}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input name="company" value={form.company} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Company Size</label>
                  <select name="companySize" value={form.companySize} onChange={handleChange}>
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Company Website</label>
                <input
                  name="companyWebsite"
                  type="url"
                  placeholder="https://acme.com"
                  value={form.companyWebsite}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>About the Company</label>
                <textarea
                  name="companyAbout"
                  rows={4}
                  placeholder="Describe your company culture, mission, and products..."
                  value={form.companyAbout}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button type="submit" className="btn" disabled={saving}>
              <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

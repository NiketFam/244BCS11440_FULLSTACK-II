import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, Bookmark, FileText, PlusCircle, LayoutDashboard, User, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const savedCount = user?.savedJobs ? user.savedJobs.length : 0;

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand-link">
          <Briefcase size={26} strokeWidth={2.3} />
          <span>HireHub</span>
          <span className="brand-badge">PRO</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">
            <Briefcase size={17} />
            <span>Find Jobs</span>
          </NavLink>

          {user?.role === "applicant" && (
            <>
              <NavLink to="/saved-jobs">
                <Bookmark size={17} />
                <span>Saved Jobs</span>
                {savedCount > 0 && <span className="badge-count">{savedCount}</span>}
              </NavLink>
              <NavLink to="/my-applications">
                <FileText size={17} />
                <span>My Applications</span>
              </NavLink>
              <NavLink to="/profile">
                <User size={17} />
                <span>Profile</span>
              </NavLink>
            </>
          )}

          {user?.role === "recruiter" && (
            <>
              <NavLink to="/dashboard">
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/post-job">
                <PlusCircle size={17} />
                <span>Post Job</span>
              </NavLink>
              <NavLink to="/profile">
                <User size={17} />
                <span>Company</span>
              </NavLink>
            </>
          )}

          <div className="nav-divider" />

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.2 }}>
                <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{user.name}</span>
                <span className="badge badge-blue" style={{ fontSize: "0.68rem", textTransform: "capitalize" }}>
                  {user.role}
                </span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Log In
              </NavLink>
              <Link to="/register" className="btn btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

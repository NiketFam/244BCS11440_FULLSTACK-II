import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import SavedJobs from "./pages/SavedJobs.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PostJob from "./pages/PostJob.jsx";
import Applicants from "./pages/Applicants.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container page">
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Applicant Routes */}
          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute role="applicant">
                <SavedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute role="applicant">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* Shared Authenticated Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute role="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id/edit"
            element={
              <ProtectedRoute role="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id/applicants"
            element={
              <ProtectedRoute role="recruiter">
                <Applicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="card text-center" style={{ padding: "3rem 1rem", maxWidth: 480, margin: "2rem auto" }}>
                <h2>Page Not Found</h2>
                <p className="muted">The requested page does not exist or may have been moved.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}

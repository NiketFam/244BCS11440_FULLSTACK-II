import { Outlet, Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard Page</h1>

      <h2>Hello Niket</h2>

      <Link to="profile">Profile</Link>
      <br />
      <Link to="settings">Settings</Link>

      <Outlet />
    </div>
  );
}

export default Dashboard;
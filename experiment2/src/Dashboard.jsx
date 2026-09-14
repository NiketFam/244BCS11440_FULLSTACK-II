import {outlet,NavLink} from "react-router-dom";
function Dashboard(){
    return(
        <>
        <h1>Dashboard</h1>
        <NavLink to="profile">Profile</NavLink>
        <NavLink to="setting">Setting</NavLink>
        <outlet/>
        </>
    );
}
export default Dashboard;
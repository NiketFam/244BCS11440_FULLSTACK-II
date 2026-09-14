import {Routes,Route,NavLink} from "react-router-dom";

function App(){
    return (
        <>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="contact" element={<Contact/>}/>
            <Route path="/dashboard" element={<Dashboard/>}>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/setting" element={<Setting/>}/>
            </Route>    
        </Routes>
        </>
    );
}
export default App;
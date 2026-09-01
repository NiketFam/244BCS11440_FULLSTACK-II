import React from '.react';

function Profilepanel(){
    const user=useUser();
    return(
        <>
        <h1>Student Details</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Year: {user.year}</p>
        </>
    );
}
export default Profilepanel;
import React from '.react';

function Header(){
    const user=useUser();
    return(
        <>
        <h1>Study Hub</h1>
        <p>Welcome {user.name} {user.year}</p>
        </>
    );
}
export default Header;
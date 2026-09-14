import React from 'react';
import Resturantpd from './Resturantpd';

function Homepd({user}){
    return(
        <>
        <h3>Home Component</h3>
        <Resturantpd user={user}/>
        </>
    );
}
export default Homepd;
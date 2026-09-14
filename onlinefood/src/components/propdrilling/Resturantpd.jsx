import React from 'react';
import Foodmenupd from './Foodmenupd';

function Resturantpd({user}){
    return(
        <>
        <h3>Resturant Component</h3>
        <Foodmenupd user={user}/>
        </>
    );
}
export default Resturantpd;
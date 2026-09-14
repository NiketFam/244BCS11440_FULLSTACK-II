import React from 'react';
import Userinfopd from './Userinfopd';

function Foodmenupd({user}){
    return(
        <>
        <h3>Foomenu Component</h3>
        <Userinfopd user={user}/>
        </>
    );
}
export default Foodmenupd;
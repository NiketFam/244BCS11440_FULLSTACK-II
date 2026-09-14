import React from 'react';
import {useState} from "react";

function LeaveForm(){
    const [reason,setReason]=useState("");
    const [message,setMessage]=useState("");
    
    const handleSubmit =()=>{
        setMessage('Leave Request submitted by ${employee.name}')
    }
}
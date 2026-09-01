import React from '.react';
import { useState } from 'react';


function Addtaskform(){
    const [text,setText]= useState('');
    function handleSubmit(e){
        e.preventDefault();
        if(!text.trim()) return;
        onAdd(text);
        setText('');
    }
    return(
        <>
        <form>
            <label>New Task:</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
            <buttom type="submit">Add Task</buttom>
        </form>
        </>
    );
}
export default Addtaskform;
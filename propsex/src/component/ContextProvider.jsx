import React, { useState } from 'react';
import ThemeContext from './ThemeContext';
import {useState} from 'react';
function ContextProvider(){
   const [theme,setTheme]= useState('dark');
    return (
        <ThemeContext.provider value={theme,setTheme}>
        <h2>Theme Context</h2>
        <h2>Current theme is:{theme}</h2>
        </ThemeContext.provider>
    );
}
export default ContextProvider;
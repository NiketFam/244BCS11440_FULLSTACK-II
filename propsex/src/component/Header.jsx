import React, { useState } from 'react';
import ThemeContext from './ThemeContext';
function Header(){
    const [theme,setTheme]=useState(ThemeContext);
    return (
        <>
        <button onClick={()=>
            setTheme(theme==="light"? "dark":"light")
        }
        style={{
            backgroundClor: theme ==="light" ? "#fff" :" #333"
        }}>Click</button>
        </>
    );
  // const employees=["Ayush","Sammer","Adil","Mannan"];
  //  return(
    //     <div>{
    //         employees.map((employee,index)=>(
    //             <div key={index}>
    //                 <h1>{index}: {employee}</h1>
    //             </div>
    //         ))
    //         }
    //     </div>


    // )

}
export default Header;
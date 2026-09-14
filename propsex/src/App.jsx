// 
import React from 'react';
// import Welcome from './Welcome';
import ContextProvider from './component/ContextProvider';
import header from "./component/header";
function App(){
 //  const students=["Ayush","Sammer","Adil","Mannan"];
return(
//     <div>{
// students.map((student,index)=>(
//     <div key={index}>
//     <h1>{index}:  {student}</h1>
//     </div>
//   ))}
// </div>
<>
   <ThemeContext.provider value={{theme,setTheme}}>
       <div>
        <h2>Current theme is:{theme}</h2>
        <header/>
        </div>
        </ThemeContext.provider>        
</>
)
}
export default App;
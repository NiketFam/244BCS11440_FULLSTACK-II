import React from '.react';
import { createContext } from 'react';

function Studentprovider(){
  const student = {
  name: "Priya Nair",
  email: "priya@gmail.com",
  year: "3rd Year",
};
const Studentcontext = createContext(null);
    return(
        <>
        <Studentcontext.Provider values={student}>
           {children} 
        </Studentcontext.Provider>
        </>
    );
}
export default Studentprovider;
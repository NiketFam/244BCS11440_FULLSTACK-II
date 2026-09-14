// import React, { use } from 'react';
// import { useContext } from 'react';
// import {UserContext} from  '../../context/UserContext';

// function Userinfocontextapi(){
//     const user=useContext(UserContext);
//     return(
//         <>
//         <h3>Customer Profile (context api)</h3>
//         <p>Name:{user.name}</p>
//         <p>Email:{user.email}</p>
//         <p>Location:{user.location}</p>
//         </>
//     );
// }
// export default Userinfocontextapi;

import React from 'react';
import { useUser } from '../../hooks/useUser';

function Userinfocontextapi() {
  const user = useUser();

  return (
    <div>
      <h3>Customer Profile (Custom Hook)</h3>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Location:</strong> {user.location}</p>
    </div>
  );
}

export default Userinfocontextapi;
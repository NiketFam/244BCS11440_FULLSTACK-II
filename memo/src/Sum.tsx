import React from "react";
import {memo} from 'react';

const Sum=React.memo(()=>{
     function totalSum(){
        console.log("Sum is Rendering");
        let sum=0;
        for(let i=0;i<1000;i++){
            sum+=i;
        }
        return sum;
    }
    
    return(
        <>
        <h2>Sum is:{totalSum()}</h2>
        </>
    );
})
// function Sum(){
//     // function totalSum(){
//     //     console.log("Sum is Rendering");
//     //     let sum=0;
//     //     for(let i=0;i<1000;i++){
//     //         sum+=i;
//     //     }
//     //     return sum;
//     // }
    
//     // return(
//     //     <>
//     //     <h2>Sum is:{totalSum()}</h2>
//     //     </>
//     // );
// }
export default Sum;
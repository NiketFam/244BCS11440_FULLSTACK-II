import { useMemo, useState } from 'react';
import './App.css';
import Sum from './Sum';

function App() {
  console.log("App is rendering");
  const [count, setCount] = useState(0);

  const total=useMemo(()=>{
    let sum=0;
        for(let i=0;i<1000;i++){
            sum+=i;
        }
        return sum;
  },[]);

  return (
    <>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      
      <hr />
      <Sum />
    </>
  );
}

export default App;

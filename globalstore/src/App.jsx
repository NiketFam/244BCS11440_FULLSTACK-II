import { useState } from 'react'
import './App.css'
import Storeheader from './Components/Storeheader'
import Productlist from './Components/Productlist'
import CheckoutKart from './Components/Checkoutkart'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Storeheader/>
    <Productlist/>
    <Checkout/>
    </>
  )
}

export default App

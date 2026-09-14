import { useContext } from "react";
import Currencycontext from "../Context/Currencycontext";

function Storeheader(){
    const {currency,changeCurrency}=useContext(Currencycontext);
    return(
        <>
        <h1>Our Store</h1>
        <button onClick={()=> changeCurrency("USD")}></button>
        <button onClick={()=> changeCurrency("EUR")}></button>
        <button onClick={()=> changeCurrency("GBP")}></button>
        <button onClick={()=> changeCurrency("JPY")}></button>

        <p>Selected Currency:{currency}</p>
        </>
    );
}
export default Storeheader;
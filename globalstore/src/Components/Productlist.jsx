import { createContext, useContext } from "react";
import Currencycontext from "../Context/Currencycontext";

function Productlist(){
    const {formatPrice}=useContext(Currencycontext);
    return(
        <>
        <h1>Product List</h1>
        <h3>Wireless headphone</h3>
        <p>Price:{formatPrice(100)}</p>
        </>
    );
}
export default Productlist;
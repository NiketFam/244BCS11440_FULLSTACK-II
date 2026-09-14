import { createContext, useContext } from "react";
import Currencycontext from "../Context/Currencycontext";

function CheckoutKart(){
    const {formatPrice}=useContext(Currencycontext);
    return(
        <>
        <h1>Checkout Kart</h1>
        <p>Total:{formatPrice(150)}</p>
        </>
    );
}
export default CheckoutKart;
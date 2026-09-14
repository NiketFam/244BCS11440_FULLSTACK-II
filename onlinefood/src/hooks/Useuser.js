import { useContext } from "react";
import {UserContext} from '../context/UserContext';

function Useuser(){
    const context =useContext(UserContext);
        if(!context){
            throw new Error ('Useuser must be use withing the a Usercontext.Provider');
        }
        return context;
}
export default Useuser;
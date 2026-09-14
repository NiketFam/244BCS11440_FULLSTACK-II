import {useNavigate} from "react-router-dom";
function Contact(){
    const navigate=useNavigate();
    const handleSubmit=(e)=>{
        e.preventDefault();
        navigate("/")
    };
    return(
        <>
            <form onSubmit={handleSubmit}>
                <button type="submit">Send Message</button>
                <input type="text"/>
            </form>  
        </>
    );
}
export default Contact;
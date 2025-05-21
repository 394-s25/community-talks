import "../css/HomePage.css";
import { useNavigate } from "react-router-dom";
export default function NavBar(){
    const navigate = useNavigate();

    return (
    <div style={{height:"8vh", width:"100vw", display:"flex", justifyContent:"space-evenly", alignItems:"center", alignContent:"center"}}>
        <button className="homepage-button" onClick={() => navigate("/profile")}>Go to Profile</button>
        <button className="homepage-button" onClick={() => navigate("/forum")}>Go to Community Forum</button>
    </div>
    );
}
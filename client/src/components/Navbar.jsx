import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/HomePage.css";

export default function NavBar({ currentPage = "/home" }) {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/home");
        } catch (err) {
            console.error("Logout failed:", err.message);
        }
    };

    return (
        <nav className="navbar bg-body-tertiary" style={{ borderBottom: "2px solid #ccc", zIndex: "1100" }} >
            <div className="container-fluid">
                <a className="navbar-brand" onClick={() => navigate("/home")}>
                    <img src="/logoicon.svg" alt="Logo" onClick={() => navigate("/home")} width="30" height="24" className="d-inline-block align-text-top" />
                    Community Talks
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav clickable-items">
                        <a className={currentPage === "/home" ? "nav-link active blue-active" : "nav-link"} aria-current="page" onClick={() => navigate("/home")}>Home</a>
                        <a className={currentPage === "/forum" ? "nav-link active blue-active" : "nav-link"} onClick={() => navigate("/forum")}>Community Forum</a>
                        <a className={currentPage === "/calendar" ? "nav-link active blue-active" : "nav-link"} onClick={() => navigate("/calendar")}>Calendar</a>
                        {currentUser ? (
                            <>
                                <a className={currentPage === "/profile" ? "nav-link active blue-active" : "nav-link"} onClick={() => navigate("/profile")}>Profile</a>
                                <a className="nav-link" onClick={handleLogout}>Sign Out</a>
                            </>
                        ) : (
                            <a className="nav-link" onClick={() => navigate("/login")}>Sign In</a>
                        )}

                        {/* <a className="nav-link disabled" aria-disabled="true">Disabled</a> */}
                    </div>
                </div>
            </div>
        </nav>
    );
}

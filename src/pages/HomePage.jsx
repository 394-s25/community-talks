import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const issueAreas = [
    {
      title: "Housing",
      entities: [
        "City Housing Comm",
        "Land Use Comm.",
        "Coalition to End Homelessness"
      ]
    },
    {
      title: "Public Safety",
      entities: [
        "Police Review Comm",
        "Public Safety Civil Service Comm",
        "Emergency Telephone Comm"
      ]
    },
    {
      title: "Environment",
      entities: [
        "Environment Board",
        "Healthy Buildings Comm.",
        "Preservation Comm."
      ]
    },
    {
      title: "Government",
      entities: [
        "City Council's Administration and Public Works Committee"
      ]
    }
  ];

  const handleEntityClick = (entity) => {
    navigate(`/department/${encodeURIComponent(entity)}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/home");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Community Talks</h1>
        <p>Your hub for engaging discussions</p>

        <div className="homepage-button-group">
          <button
            className="homepage-button"
            onClick={() => navigate("/profile")}
          >
            Go to Profile
          </button>
          <button
            className="homepage-button logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="homepage-grid">
        {issueAreas.map((area) => (
          <div key={area.title} className="homepage-column">
            <h2 className="homepage-column-header">{area.title}</h2>
            <ul className="homepage-list">
              {area.entities.map((ent) => (
                <li
                  key={ent}
                  className="homepage-list-item"
                  onClick={() => handleEntityClick(ent)}
                >
                  {ent}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
}

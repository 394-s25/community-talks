import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/Navbar";
import PageLoader from "../components/PageLoader";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [issueAreas, setIssueAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(ref(db, "Community"));
      const data = snapshot.val();

      if (data) {
        const priority = [
          "Standing Committees of the Council",
          "Special Committees of the Council"
        ];

        const structured = [];

        for (const key of priority) {
          if (data[key]) {
            structured.push({
              title: key,
              entities: Object.entries(data[key]).map(([slug, item]) => ({
                name: item.name,
                slug: item.slug || slug
              }))
            });
          }
        }

        for (const [category, items] of Object.entries(data)) {
          if (!priority.includes(category)) {
            structured.push({
              title: category,
              entities: Object.entries(items).map(([slug, item]) => ({
                name: item.name,
                slug: item.slug || slug
              }))
            });
          }
        }

        setIssueAreas(structured);
      }
    };

    fetchData();
    setIsLoading(false);
  }, []);

  const handleEntityClick = (category, slug) => {
    const encodedCategory = encodeURIComponent(category);
    const encodedSlug = encodeURIComponent(slug);
    navigate(`/department/${encodedCategory}/${encodedSlug}`);
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
    <div>
      <NavBar/>
    
      <div className="homepage-container">
        <header className="homepage-header">
          <h1>Welcome to Community Talks</h1>
          <p>Your hub for engaging discussions</p>

          

          {/* <div className="homepage-button-group">
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
          </div> */}

        </header>

        <PageLoader loading={isLoading}>
          <main className="homepage-grid">
            {issueAreas.map((area) => (
              <div key={area.title} className="homepage-column">
                <h2 className="homepage-column-header">{area.title}</h2>
                <ul className="homepage-list">
                  {area.entities.map(({ slug, name }) => (
                    <li
                      key={slug}
                      className="homepage-list-item"
                      onClick={() => handleEntityClick(area.title, slug)}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </main>
        </PageLoader>
      </div>
    </div>
  );
}

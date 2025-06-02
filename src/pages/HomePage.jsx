import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/Navbar";
import PageLoader from "../components/PageLoader";
import "../css/HomePage.css";
import SidebarNav from "../components/SidebarNav";

import {
  FaUsers,
  FaCogs,
  FaUniversity,
  FaChartBar,
  FaLeaf,
  FaBalanceScale,
  FaSchool,
  FaBusinessTime,
  FaBuilding,
  FaHandsHelping,
  FaGavel,
  FaHandshake,
  FaShieldAlt,
  FaLandmark,
  FaHouseUser,
  FaVoteYea,
  FaPeopleArrows,
  FaRegLightbulb
} from "react-icons/fa";




const getIconForTitle = (title) => {
  const titleLower = title.toLowerCase();

  if (titleLower.includes("equity")) return <FaPeopleArrows className="column-icon icon-equity" />;
  if (titleLower.includes("government") || titleLower.includes("democracy")) return <FaVoteYea className="column-icon icon-government" />;
  if (titleLower.includes("housing")) return <FaHouseUser className="column-icon icon-housing" />;
  if (titleLower.includes("public safety")) return <FaShieldAlt className="column-icon icon-safety" />;
  if (titleLower.includes("human services")) return <FaHandsHelping className="column-icon icon-services" />;
  if (titleLower.includes("zoning") || titleLower.includes("infrastructure")) return <FaLandmark className="column-icon icon-zoning" />;
  if (titleLower.includes("development")) return <FaBusinessTime className="column-icon icon-development" />;
  if (titleLower.includes("environment")) return <FaLeaf className="column-icon icon-environment" />;
  if (titleLower.includes("education") || titleLower.includes("youth")) return <FaSchool className="column-icon icon-education" />;
  if (titleLower.includes("ethics") || titleLower.includes("legal")) return <FaBalanceScale className="column-icon icon-ethics" />;
  if (titleLower.includes("rules") || titleLower.includes("committee")) return <FaGavel className="column-icon icon-default" />;

  return <FaRegLightbulb className="column-icon icon-default" />; // fallback icon
};



export default function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth?.() || {};
  const [issueAreas, setIssueAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const handleSidebarSelect = (title) => {
    setHighlightedSection(title);

  };

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
        setIsLoading(false);
      }
    };

    fetchData();
    // setIsLoading(false);
  }, []);

  const handleEntityClick = async (category, slug) => {
    const encodedCategory = encodeURIComponent(category);
    const encodedSlug = encodeURIComponent(slug);

    try {
      const detailRef = ref(db, `detail/${category}/${slug}`);
      const snapshot = await get(detailRef);
      const detailData = snapshot.val();

      if (detailData) {
        // 
        navigate(`/department/${encodedCategory}/${encodedSlug}`);
      } else {
        // 
        const communityRef = ref(db, `Community/${category}`);
        const communitySnap = await get(communityRef);
        const communityEntries = communitySnap.val();

        if (communityEntries) {
          const entry = Object.values(communityEntries).find(
            (item) => item.slug === slug || item.name === slug
          );

          if (entry?.link) {
            window.open(entry.link, "_blank");
          } else {
            alert("No detailed page or link available.");
          }
        } else {
          alert("No community data found.");
        }
      }
    } catch (err) {
      console.error("Error checking detail data:", err);
      alert("Failed to open the committee details.");
    }
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
      <NavBar />

      <div className="homepage-container">




        <div className="homepage-layout">

          <SidebarNav
            sections={issueAreas}
            getIconForTitle={getIconForTitle}

            onSelect={(title) => {
              const targetId = title.replace(/\s+/g, "-").toLowerCase();
              const element = document.getElementById(targetId);
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                setHighlightedSection(targetId);

                //  2s remove highlight
                setTimeout(() => setHighlightedSection(null), 2000);
              }
            }}
          />


          <main className="homepage-main">
            <header className="homepage-header">
              <h1>Welcome to Community Talks</h1>
              <p>Your hub for engaging discussions</p>
            </header>
            <PageLoader loading={isLoading}>
              <div className="homepage-grid">
                {issueAreas.map((area) => (
                  <div
                    key={area.title}
                    id={area.title.replace(/\s+/g, "-").toLowerCase()}
                    className={`homepage-column ${highlightedSection === area.title.replace(/\s+/g, "-").toLowerCase()
                      ? "highlight"
                      : ""
                      }`}
                  >
                    <h2 className="homepage-column-header">
                      {getIconForTitle(area.title)} {area.title}
                    </h2>

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
              </div>
            </PageLoader>
          </main>
        </div>
      </div>
    </div>


  );
}

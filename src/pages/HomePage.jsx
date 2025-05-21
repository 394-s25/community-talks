// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/HomePage.css";

// export default function HomePage() {
//   const navigate = useNavigate();

//   const issueAreas = [
//     {
//       title: "Housing",
//       entities: [
//         "City Housing Comm",
//         "Land Use Comm.",
//         "Coalition to End Homelessness"
//       ]
//     },
//     {
//       title: "Public Safety",
//       entities: [
//         "Police Review Comm",
//         "Public Safety Civil Service Comm",
//         "Emergency Telephone Comm"
//       ]
//     },
//     {
//       title: "Environment",
//       entities: [
//         "Environment Board",
//         "Healthy Buildings Comm.",
//         "Preservation Comm."
//       ]
//     },
//     {
//       title: "Government",
//       entities: [
//         "City Council's Administration and Public Works Committee"
//       ]
//     }
//   ];


//   const handleEntityClick = (entity) => {
//     navigate(`/department/${encodeURIComponent(entity)}`);
//   };

//   return (
//     <div className="homepage-container">
//       <header className="homepage-header">
//         <h1>Welcome to Community Talks</h1>
//         <p>Your hub for engaging discussions</p>
//         <button
//           className="homepage-button"
//           onClick={() => navigate("/profile")}
//         >
//           Go to Profile
//         </button>
//       </header>

//       <main className="homepage-grid">
//         {issueAreas.map((area) => (
//           <div key={area.title} className="homepage-column">
//             <h2 className="homepage-column-header">{area.title}</h2>
//             <ul className="homepage-list">
//               {area.entities.map((ent) => (
//                 <li
//                   key={ent}
//                   className="homepage-list-item"
//                   onClick={() => handleEntityClick(ent)}
//                 >
//                   {ent}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </main>
//     </div>
//   );
// }




// 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import NavBar from "../components/Navbar";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [issueAreas, setIssueAreas] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const snapshot = await get(ref(db, "Community"));
  //     const data = snapshot.val();

  //     if (data) {
  //       const priority = [
  //         "Standing Committees of the Council",
  //         "Special Committees of the Council"
  //       ];

  //       const structured = [];

  //       for (const key of priority) {
  //         if (data[key]) {
  //           structured.push({
  //             title: key,
  //             entities: Object.entries(data[key]).map(([slug, item]) => ({ slug, name: item.name }))
  //           });
  //         }
  //       }

  //       for (const [category, items] of Object.entries(data)) {
  //         if (!priority.includes(category)) {
  //           structured.push({
  //             title: category,
  //             // entities: Object.entries(items).map(([slug, item]) 
  //             // 
  //             // 
  //             entities: Object.values(data[key]).map((item) => ({
  //               name: item.name,
  //               slug: item.slug || item.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/gi, "")
  //             }))
  //             // => ({ slug, name: item.name }))
  //           });
  //         }
  //       }

  //       setIssueAreas(structured);
  //     }
  //   };

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
  
        // 
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
  
        // 
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
  }, []);
  

  //   fetchData();
  // }, []);

  const handleEntityClick = (category, slug) => {
    const encodedCategory = encodeURIComponent(category);
    const encodedSlug = encodeURIComponent(slug);
    navigate(`/department/${encodedCategory}/${encodedSlug}`);
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Community Talks</h1>
        <p>Your hub for engaging discussions</p>
        <NavBar/>
      </header>

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
    </div>
  );
}

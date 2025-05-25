// src/utils/uploadCommunityData.js
import { db } from "../firebase";
import { ref, set } from "firebase/database";

// This is a mock dataset for community groups and committees
const communityData = [
  {
    category: "Standing Committees of the Council",
    entries: [
      "Administration & Public Works",
      "Human Services",
      "Planning & Development",
      "Rules",
      "Referrals Committee",
    ],
  },
  {
    category: "Special Committees of the Council",
    entries: [
      "Alternative Emergency Response Subcommittee",
      "City-School Liaison Committee",
      "Electoral Board",
      "Northwestern University/City Committee",
    ],
  },
  {
    category: "Housing & Land Use",
    entries: [
      "Land Use Commission",
      "Housing & Community Development Committee",
      "Zoning Board of Appeals",
    ],
  },
  {
    category: "Public Safety & Justice",
    entries: [
      "Citizen Police Review Commission",
      "Public Safety Civil Service Commission",
      "Reimagining Public Safety Committee",
      "Police Pension Board",
    ],
  },
  {
    category: "Environment & Infrastructure",
    entries: [
      "Environment Board",
      "Utilities Commission",
      "Transportation and Parking Committee",
    ],
  },
  {
    category: "Historic Preservation & Design",
    entries: [
      "Preservation Commission",
      "Design and Project Review Committee",
    ],
  },
  {
    category: "Economic Development & Finance",
    entries: [
      "Economic Development Committee",
      "Finance & Budget Committee",
      "M/W/EBE Development Committee",
    ],
  },
  {
    category: "Social Services & Equity",
    entries: [
      "Social Services Committee",
      "Equity and Empowerment Commission",
      "Reparations Committee",
    ],
  },
  {
    category: "Arts & Culture",
    entries: ["Evanston Arts Council", "Public Art Committee"],
  },
  {
    category: "Youth & Education",
    entries: ["Youth Advisory Committee", "Library Board"],
  },
  {
    category: "Ethics & Governance",
    entries: [
      "Board of Ethics",
      "Board of Local Improvements",
      "Liquor Control Review Board",
    ],
  },
  {
    category: "Accessibility & Inclusion",
    entries: [
      "Americans with Disabilities Act Advisory Board",
      "Healthy Buildings Accountability Board",
      "Healthy Buildings Technical Committee",
    ],
  },
];

// export async function uploadCommunityDataset() {
//   const dataRef = ref(db, "Community");
//   const dataset = {};

//   let idCounter = 1;

//   for (const group of communityData) {
//     for (const name of group.entries) {
//       const id = `comm-${idCounter.toString().padStart(4, "0")}`;
//       dataset[id] = {
//         id,
//         name,
//         category: group.category,
//         link: "", // 
//       };
//       idCounter++;
//     }
//   }

//   try {
//     await set(dataRef, dataset);
//     console.log("✅ Community data uploaded.");
//   } catch (error) {
//     console.error("❌ Upload failed:", error);
//   }
// }

export async function uploadCommunityDataset() {
  const dataRef = ref(db, "Community");
  const dataset = {};

  let idCounter = 1;

  for (const group of communityData) {
    const categoryKey = group.category;
    if (!dataset[categoryKey]) dataset[categoryKey] = {};

    for (const name of group.entries) {
      const id = `comm-${idCounter.toString().padStart(4, "0")}`;
      dataset[categoryKey][id] = {
        id,
        name,
        link: ""
      };
      idCounter++;
    }
  }

  try {
    await set(dataRef, dataset);
    console.log("✅ Nested community data uploaded.");
  } catch (error) {
    console.error("❌ Upload failed:", error);
  }
}

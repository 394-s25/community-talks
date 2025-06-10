// src/utils/uploadCommunityData.js
import { db } from "../firebase";
import { ref, set } from "firebase/database";


const communityData = [
  {
    category: "Housing & Community Development",
    entries: [
      {
        name: "Housing & Community Development Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/housing-community-development-committee",
      },
      {
        name: "Land Use Commission",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/land-use-commission",
      },
      {
        name: "Reparations Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/reparations-committee",
      },
      {
        name: "Utilities Commission",
        link: "", // Not found in PDF
      },
      {
        name: "Planning & Development Housing Sub-Committee",
        link: "", // Not found in PDF
      },
    ],
  },
  {
    category: "Environment",
    entries: [
      {
        name: "Environment Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/environment-board",
      },
      {
        name: "Healthy Buildings Accountability Board",
        link: "https://www.cityofevanston.org/government/healthy-buildings-accountability-board-hbab-and-technical-committee-hbtc",
      },
      {
        name: "Healthy Buildings Technical Committee",
        link: "https://www.cityofevanston.org/government/healthy-buildings-accountability-board-hbab-and-technical-committee-hbtc",
      },
      {
        name: "Parks and Recreation Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/park-recreation-board",
      },
    ],
  },
  {
    category: "Public Safety",
    entries: [
      {
        name: "Alternative Emergency Response Subcommittee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/alternatives-to-911-committee",
      },
      {
        name: "911-Emergency Telephone System",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/911-emergency-telephone-system-board",
      },
      {
        name: "Citizen Police Review Commission",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/citizen-police-review-commission",
      },
      {
        name: "Public Safety Civil Service Commission",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/public-safety-civil-service-commission",
      },
      {
        name: "Reimagining Public Safety Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/reimagining-public-safety-committee",
      },
      {
        name: "Alternatives to Arrest Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/alternatives-to-arrest-committee",
      },
    ],
  },
  {
    category: "Business & Economic Development",
    entries: [
      {
        name: "Planning & Development",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/planning-development",
      },
      {
        name: "Economic Development Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/economic-development-committee",
      },
      {
        name: "Liquor Control Review Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/liquor-control-review-board",
      },
      {
        name: "M/W/EBE Development Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/m-w-ebe-development-committee",
      },
      {
        name: "Evanston Arts Council",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/evanston-arts-council",
      },
    ],
  },
  {
    category: "Equity",
    entries: [
      {
        name: "Commission on Aging and Disabilities",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/commission-on-aging",
      },
      {
        name: "Equity and Empowerment Commission",
        link: "https://www.cityofevanston.org/government/equity-empowerment/equity-and-empowerment-commission",
      },
      {
        name: "Reparations Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/reparations-committee",
      },
      {
        name: "M/W/EBE Development Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/m-w-ebe-development-committee",
      },
      {
        name: "Alternatives to Arrest Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/alternatives-to-arrest-committee",
      },
    ],
  },
  {
    category: "Zoning & Infrastructure",
    entries: [
      {
        name: "Administration & Public Works",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/administration-public-works",
      },
      {
        name: "Planning & Development",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/planning-development",
      },
      {
        name: "Northwestern University/City Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/northwestern-university-city-committee",
      },
      {
        name: "Preservation Commission",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/preservation-commission",
      },
      {
        name: "Board of Local Improvements",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/board-of-local-improvements",
      },
      {
        name: "Design & Project Review Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/design-project-review-committee",
      },
    ],
  },
  {
    category: "Education & Youth",
    entries: [
      {
        name: "City-School Liaison Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/city-school-liaison-committee",
      },
      {
        name: "Library Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/library-board",
      },
      {
        name: "Evanston/Skokie District 65 School Board",
        link: "https://www.district65.net/about/board-of-education",
      },
      {
        name: "Evanston Township High School District 202 School Board",
        link: "https://www.eths.k12.il.us/domain/22",
      },
    ],
  },
  {
    category: "Budget & Finance",
    entries: [
      {
        name: "Finance & Budget Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/finance-and-budget-committee"
      },
      {
        name: "Firefighter's Pension Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/firefighter-s-pension-board"
      },
      {
        name: "Police Pension Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/police-pension-board"
      },
      {
        name: "Compensation Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/compensation-committee"
      },
      {
        name: "Participatory Budgeting Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/short-term-committees-task-forces/participatory-budgeting-committee"
      },
      {
        name: "Five-Fifths TIF Advisory Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/five-fifths-tif-advisory-committee"
      },
      {
        name: "Joint Review Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/joint-board"
      },
      {
        name: "Evanston Arts Council",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/evanston-arts-council"
      }
    ]
  },
  {
    category: "Human Services",
    entries: [
      {
        name: "Human Services",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/human-services"
      },
      {
        name: "Social Services Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/social-services-committee"
      }
    ]
  },
  {
    category: "Government & Democracy",
    entries: [
      {
        name: "Rules",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/rules"
      },
      {
        name: "Referrals Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/referrals-committee/-fsiteid-1"
      },
      {
        name: "Electoral Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/electoral-board"
      },
      {
        name: "Board of Ethics",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/board-of-ethics"
      },
      {
        name: "Redistricting Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/redistricting-committee"
      },
      {
        name: "Participatory Budgeting Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/short-term-committees-task-forces/participatory-budgeting-committee"
      }
    ]
  },
  {
    category: "Standing Committees of the Council",
    entries: [
      {
        name: "Administration & Public Works",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/administration-public-works"
      },
      {
        name: "Human Services",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/human-services"
      },
      {
        name: "Planning & Development",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/planning-development"
      },
      {
        name: "Rules",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/rules"
      },
      {
        name: "Referrals Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/referrals-committee"
      }
    ]
  },
  {
    category: "Special Committees of the Council",
    entries: [
      {
        name: "Alternative Emergency Response Subcommittee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/alternatives-to-911-committee"
      },
      {
        name: "City-School Liaison Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/city-school-liaison-committee"
      },
      {
        name: "Electoral Board",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/electoral-board"
      },
      {
        name: "Northwestern University/City Committee",
        link: "https://www.cityofevanston.org/government/boards-commissions-and-committees/northwestern-university-city-committee"
      }
    ]
  }

];

export async function uploadCommunityDataset_new() {
  const dataRef = ref(db, "Community");
  const dataset = {};

  let idCounter = 1;

  for (const group of communityData) {
    const categoryKey = group.category;
    if (!dataset[categoryKey]) dataset[categoryKey] = {};

    for (const entry of group.entries) {
      const id = `comm-${idCounter.toString().padStart(4, "0")}`;
      dataset[categoryKey][id] = {
        id,
        name: entry.name,
        link: entry.link || ""
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

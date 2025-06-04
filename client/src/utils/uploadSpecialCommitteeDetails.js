import { db } from "../firebase";
import { ref, set } from "firebase/database";

// 🟣 Special Committees of the Council
const details = {
  "alternative-emergency-response-subcommittee": {
    name: "Alternative Emergency Response Subcommittee",
    category: "Special Committees of the Council",
    description:
      "The Alternative Emergency Response Subcommittee is responsible for developing a non police response to members of the community who are in need of immediate support (not including life saving medical situations)...",
    meetingPlace: "",
    meetingSchedule: "",
    recordings: [
      {
        date: "September 13, 2022",
        link: "https://youtu.be/BnBEfjDlrYg",
      },
      {
        date: "August 16, 2022",
        link: "https://youtu.be/TgQs3vfHmPI",
      },
    ],
    lastUpdated: new Date().toISOString(),
  },

  "city-school-liaison-committee": {
    name: "City-School Liaison Committee",
    category: "Special Committees of the Council",
    description:
      "To enable officials of the City Government and the two School Boards to confer on a regular basis to achieve community financial coordination...",
    meetingSchedule: "Three (3) times during the academic year at 5:30 P.M.",
    meetingPlace:
      "Rotates between Lorraine H. Morton Civic Center, Evanston Township High School, District 65 Joseph E. Hill Education Center.",
    reportsTo: "City Council & District 65 & 202 School Boards",
    members: [
      {
        name: "Councilmember Burns",
        term: "5/2021 - 5/2025",
        profileLink:
          "https://www.cityofevanston.org/government/city-council/5th-ward",
      },
      {
        name: "Councilmember Kelly",
        term: "5/2021 - 5/2025",
        profileLink:
          "https://www.cityofevanston.org/government/city-council/1st-ward#!/",
      },
      {
        name: "Councilmember Nieuwsma",
        term: "5/2021 - 5/2025",
        profileLink:
          "https://www.cityofevanston.org/government/city-council/4th-ward/-fsiteid-1",
      },
    ],
    staff: [
      "City Manager's Office, 847.866.2936",
      "Dr. Angel Turner, District 65 Interim Superintendent",
      "Dr. Marcus Campbell, District 202 Superintendent",
    ],
    meetings: [],
    lastUpdated: new Date().toISOString(),
  },

  "northwestern-university-city-committee": {
    name: "Northwestern University-City Committee",
    category: "Special Committees of the Council",
    description:
      "The University and the City have agreed to establish a special committee comprised of: (i) two representatives from the University...",
    meetingSchedule:
      "Meets on a regular basis or as needed in public meetings.",
    meetingPlace: "Morton Civic Center, 2100 Ridge Ave.",
    termInfo:
      "Community representatives serve 4-year staggered terms as per Ordinance 56-O-06.",
    members: [
      {
        name: "Clare Kelly",
        role: "First Ward Councilmember, Presiding Member",
        term: "N/A",
      },
      {
        name: "Dave Davis",
        role: "Northwestern University",
        term: "N/A",
      },
      {
        name: "David Schoenfeld",
        role: "Community Representative",
        term: "09/2027",
      },
      {
        name: "Bob Hercules",
        role: "Community Representative",
        term: "05/2029",
      },
    ],
    staff: ["Luke Stowe, City Manager, City Manager's Office"],
    recordings: [
      {
        date: "August 31, 2023",
        link: "https://youtu.be/zpigVWhOZqU",
      },
      {
        date: "June 14, 2023",
        link: "https://youtu.be/wLn51qSUeHg",
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
};

// 🟢 Upload function
export const uploadSpecialCommitteeDetails = async () => {
  for (const [slug, data] of Object.entries(details)) {
    const path = `detail/Special Committees of the Council/${slug}`;
    await set(ref(db, path), data);
    console.log(`✅ Uploaded: ${slug}`);
  }
};

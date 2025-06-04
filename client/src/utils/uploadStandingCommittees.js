import { db } from "../firebase";
import { ref, set } from "firebase/database";

const details = {
  "administration-public-works": {
    "name": "Administration & Public Works",
    "category": "Standing Committees of the Council",
    "description": `Matters relating to the bills and purchases; budget policy; finance; fire; legal; licensing; personnel; public works, including: streets and alleys, lighting, refuse disposal, water and sewers, traffic control, and parking; public buildings, public transportation; public utilities; safety (including civil defense); liaison with the police and fire pension boards; and capital improvements.
      # OF MEMBERS: Five (5) Councilmembers are appointed.`,
    "meetingSchedule": "",
    "meetingPlace": "Lorraine H. Morton City Hall, Council Chambers",
    "reportsTo": "City Council",
    "members": [
      {
        "name": "Councilmember Parielle Davis",
        "profileLink": "https://www.cityofevanston.org/government/city-council/7th-ward"
      },
      {
        "name": "Councilmember Krissie Harris",
        "profileLink": "https://www.cityofevanston.org/government/city-council/2nd-ward"
      },
      {
        "name": "Councilmember Clare Kelly",
        "profileLink": "https://www.cityofevanston.org/government/city-council/1st-ward"
      },
      {
        "name": "Councilmember Nieuwsma",
        "profileLink": "https://www.cityofevanston.org/government/city-council/4th-ward"
      },
      {
        "name": "Councilmember Suffredin",
        "role": "Chair",
        "profileLink": "https://www.cityofevanston.org/government/city-council/6th-ward"
      }
    ],
    "staff": [
      {
        "name": "Edgar Cano",
        "title": "Director of Public Works",
        "email": "ecano@cityofevanston.org"
      }
    ],
    "meetings": [
      {
        title: "Administration & Public Works Committee",
        date: "2025-05-12",
        time: "5:15 PM - 6:00 PM",
        location: "Lorraine H. Morton City Hall - Council Chambers, 909 Davis Street, Evanston, Illinois 60201"
      },
      {
        title: "MWDEBE Development Committee",
        date: "2025-05-21",
        time: "6:00 PM - 7:30 PM",
        location: "City Hall, 909 Davis, Evanston, Illinois 60201"
      },
      {
        title: "ADA Advisory Committee",
        date: "2025-05-22",
        time: "3:00 PM",
        location: "Evanston Public Library, 1703 Orrington Avenue, Evanston, Illinois 60201"
      },
      {
        title: "Memorial Day Ceremony",
        date: "2025-05-26",
        time: "10:30 AM",
        location: "Fountain Square, Davis Street at Sherman and Orrington Avenues, Evanston, Illinois 60201"
      },
      {
        title: "Referrals Committee",
        date: "2025-05-27",
        time: "4:45 PM - 5:00 PM",
        location: "Lorraine H. Morton City Hall - Council Chambers, 909 Davis Street, Evanston, Illinois 60201"
      }
    ]
    ,
    "recordings": [
      {
        "date": "2025-05-12",
        "link": "https://youtu.be/RArWkNTRJl0"
      },
      {
        "date": "2025-04-28",
        "link": "https://youtu.be/IQtLFnZeaDE"
      }
    ],
    "lastUpdated": "2025-05-17T23:32:41.501718"
  },
  "human-services": {
    "name": "Human Services Committee",
    "category": "Standing Committees of the Council",
    "description": "The duties of this committee include matters relating to the Department of Health and Human Services (including: public health, mental health, general and emergency assistance, workforce); community purchased services, aging, youth, liaison with the human service-related boards and commissions, private and public organizations funding or providing human services within the City, and matters relating to the arts, recreation, library, environment, unemployment, unified budgeting, the Farmers' Market, and Police services; Americans with Disabilities Act ('ADA') Grievance Appeals relating to Title II of the ADA (Accessibility). The Environment Board also reports to this Committee.\n\n# OF MEMBERS: Five (5) Councilmembers are appointed.",
    "meetingSchedule": "Meet on the first Monday of every month at 5:00 PM.",
    "meetingPlace": "Lorraine H. Morton City Hall, Council Chambers, 2nd Floor, 909 Davis St., Evanston, IL 60201",
    virtualMeeting: {
      watchOptions: [
        {
          type: "Website",
          platform: "City of Evanston TV",
          url: "https://www.cityofevanston.org/tv"
        },
        {
          type: "Cable",
          platform: "Comcast",
          channel: "Channel 16"
        },
        {
          type: "Cable",
          platform: "AT&T U-Verse",
          channel: "Channel 99",
          instructions: "Select Evanston, then City Channel 16"
        }
      ],
      publicComment: {
        methods: [
          "written comments in advance",
          "phone or video during the meeting"
        ],
        signUpForm: "https://www.cityofevanston.org/government/city-clerk/public-comment-sign-up",
        contact: "847-448-4311"
      }
    },

    "reportsTo": "City Council",
    "members": [
      {
        "name": "Councilmember Krissie Harris"
      },
      {
        "name": "Councilmember Shawn Iles"
      },
      {
        "name": "Councilmember Bobby Burns"
      },
      {
        "name": "Councilmember Matt Rodgers"
      },
      {
        "name": "Councilmember Juan Geracaris",
        "role": "Chair"
      }
    ],
    "staff": [
      {
        "name": "Ike Ogbo",
        "email": "iogbo@cityofevanston.org"
      }
    ],
    "recordings": [
      {
        "date": "2025-04-07",
        "link": "https://youtu.be/kYcWDOLx9Ao"
      },
      {
        "date": "2025-02-05",
        "link": "https://youtu.be/zZMklj_ebM8"
      }
    ],
    "lastUpdated": "2025-05-17T23:35:05.274465"
  },
  "planning-development": {
    name: "Planning & Development Committee",
    category: "Standing Committees of the Council",
    description:
      "This Committee addresses matters relating to planning, physical development, zoning, building conservation, preservation, housing, and relocation. The Committee shall review and advise the City Council on the use and planning of all City park land. # OF MEMBERS: Seven (7) Aldermen are appointed.",
    recordings: [
      { date: "2025-04-28", link: "https://youtu.be/RZkwblEpxBk" },
      { date: "2025-04-14", link: "https://youtu.be/_05y2lzrhj0" }
    ],
    lastUpdated: new Date().toISOString()
  },
  "rules": {
    name: "Rules",
    category: "Standing Committees of the Council",
    description: `This committee has jurisdiction of the following:

  Assignment of alderman to committees including the Budget Committee, Parking Committee, Economic Development Committee, and Housing & Community Development Act Committee (CD Committee) which recommends to the Council expenditure of Federal funds.
  Determination of jurisdictional disputes between committees.
  Revision of the Council Rules.
  Preparation and maintenance of the list of mayor pro tem.
  Insure compliance with the Illinois Open Meetings Act.
  Appointment of chairs to standing committees.
  Coordination of the City Manager evaluation.
  Such other matters as referred to it by the Council or Mayor.

  # OF MEMBERS: Nine (9) Aldermen and the Mayor are appointed.`,
    meetingSchedule: "Committee meets as needed, concurrent with City Council meetings.",
    meetingPlace: "909 Davis, 2nd Floor Council Chambers",
    reportsTo: "City Council",
    virtualMeeting: {
      watchOptions: [
        {
          type: "Website",
          platform: "City of Evanston TV",
          url: "https://www.cityofevanston.org/tv"
        },
        {
          type: "Cable",
          platform: "Comcast",
          channel: "Channel 16"
        },
        {
          type: "Cable",
          platform: "AT&T U-Verse",
          channel: "Channel 99",
          instructions: "Select Evanston, then City Channel 16"
        }
      ],
      publicComment: {
        methods: [
          "written comments in advance",
          "phone or video during the meeting"
        ],
        signUpForm: "https://www.cityofevanston.org/government/city-clerk/public-comment-sign-up",
        contact: "847-448-4311"
      }
    },
    staff: ["Corporation Counsel"],
    members: [
      { name: "Councilmember Clare Kelly" },
      { name: "Councilmember Krissie Harris" },
      { name: "Councilmember Shawn Iles" },
      { name: "Councilmember Jonathan Nieuwsma" },
      { name: "Councilmember Bobby Burns" },
      { name: "Councilmember Thomas Suffredin" },
      { name: "Councilmember Parielle Davis" },
      { name: "Councilmember Matt Rodgers" },
      { name: "Councilmember Juan Geracaris" },
      { name: "Mayor Daniel Biss" }
    ],
    recordings: [
      { date: "2025-05-12", link: "https://youtu.be/-xSH8K4silY" },
      { date: "2025-05-05", link: "https://youtu.be/SXQYx8DqBio" },
      { date: "2025-04-14", link: "https://youtu.be/YVDC-SqsG1Q" }
    ],
    lastUpdated: new Date().toISOString()
  },
  "referrals-committee": {
    name: "Referrals Committee",
    category: "Standing Committees of the Council",
    description: `The duty of this committee is to consider referred agenda items made by the Mayor, a Councilmember, or the City Manager based on a transparent and established set of criteria. The committee will refer them to a board, committee, commission, or the City Council with instructions as to the action the item will take. 

    The Referrals Committee was created in 2021 under the 81st City Council. There were no referrals prior to 2021.`,
    meetingSchedule: "Second and fourth Mondays of the month at 4:45 p.m.",
    meetingPlace: "City Hall's Council Chambers",
    members: [
      { name: "Mayor Daniel Biss", role: "Chair" },
      { name: "Councilmember Revelle" },
      { name: "Councilmember Suffredin" }
    ],
    recordings: [
      { date: "2025-05-12", link: "https://youtu.be/x-mufsIO1mw" },
      { date: "2022-07-14", link: "https://www.youtube.com/watch?v=yDyrfetIOL8" }
    ],
    lastUpdated: new Date().toISOString()
  }
};

export const uploadStandingCommitteeDetails = async () => {
  for (const [slug, data] of Object.entries(details)) {
    const path = `detail/Standing Committees of the Council/${slug}`;
    await set(ref(db, path), data);
    console.log(`✅ Uploaded: ${slug}`);
  }
};

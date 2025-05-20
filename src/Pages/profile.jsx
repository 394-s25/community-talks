import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpcomingMeetings from '../components/UpcomingMeetings';
import { auth, db } from "../firebase";
import { ref, set, get, child } from "firebase/database";
import "../css/Issue.css";

const meetings = [
  {
    id: '1234567890',
    title: 'Weekly Team Sync',
    startTime: '2025-05-13T10:00:00',
    password: '123456',
  },
  {
    id: '9876543210',
    title: 'Project Planning',
    startTime: '2025-05-13T15:00:00',
    password: '654321',
  },
];


const allPreferences = [
  "Virtual Comments",
  "In-person Comments",
  "Written Submissions",
  "Video/Voice Recorded Comments",
  "Community Surveys"
];


const initialInterests = [
  { label: "City Council's Administration and Public Works Committee" },
  { label: "City Housing Committee" },
  { label: "Police Review Committee" },
  { label: "Environment Board" },
  { label: "Zoning Committee" },
];



const allInterestOptions = [
  "Housing & Community Development",
  "Environment",
  "Public Safety",
  "Business & Economic Development",
  "Equity",
  "Zoning & Infrastructure",
  "Education & Youth",
  "Budget & Finance",
  "Human Services",
  "Government & Democracy"
];

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [newZipcode, setNewZipcode] = useState("");
  const [interests, setInterests] = useState(initialInterests);
  const [preferences, setPreferences] = useState([]);

  const navigate = useNavigate();

  // const handleAddInterest = (label) => {
  //   if (!interests.find(item => item.label === label)) {
  //     setInterests((prev) => [...prev, { label }]);
  //     // Optional: persist to Firebase
  //   }
  // };



  const updateInterestsInDB = async (updatedInterests) => {
    const user = auth.currentUser;
    if (user) {
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        zipcode: zipcode,
        interests: updatedInterests,
        preferences: preferences
      });
    }
  };
  
  const handleAddInterest = async (label) => {
    const updated = [...interests, { label }];
    setInterests(updated);
    await updateInterestsInDB(updated);
  };
  
  const handleRemoveInterest = async (label) => {
    const updated = interests.filter(item => item.label !== label);
    setInterests(updated);
    await updateInterestsInDB(updated);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setEmail(user.email);
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${user.uid}`));
        if (snapshot.exists()) {
          setZipcode(snapshot.val().zipcode || "");
          setInterests(snapshot.val().interests || []);
          setPreferences(snapshot.val().preferences || []);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const isValidUSZip = (zip) =>
    /^\d{5}$/.test(zip) && parseInt(zip, 10) >= 501 && parseInt(zip, 10) <= 99950;

  const handleZipcodeUpdate = async () => {
    const zip = newZipcode.trim();

    if (!isValidUSZip(zip)) {
      alert("❌ Please enter a valid 5-digit US ZIP Code in range.");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        zipcode: zip,
        interests: interests,
        preferences: preferences
      });
      setZipcode(zip);
      setNewZipcode("");
    }
  };



  const togglePreference = (pref) => {
    const updated = preferences.includes(pref)
      ? preferences.filter(p => p !== pref)
      : [...preferences, pref];
    setPreferences(updated);
  };

  const handleSavePreferences = async () => {
    const user = auth.currentUser;
    if (user) {
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        zipcode: zipcode,
        interests: interests,
        preferences: preferences
      });
      alert("✅ Preferences updated!");
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: "column", height: '100vh', margin: '1rem' }}>
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <div>
        <h2 className='page-title'>Profile</h2>
        <p className="page-subtitle"><strong>Email:</strong> {email}</p>
        <p className="page-subtitle"><strong>Zipcode:</strong> {zipcode}</p>
        <input
          type="text"
          placeholder="Enter new zipcode"
          value={newZipcode}
          onChange={(e) => setNewZipcode(e.target.value)}
        />
        <button onClick={handleZipcodeUpdate}>Update Zipcode</button>
      </div>

      <div style={{ display: 'flex', alignItems: "flex-start", justifyContent: "left" }}>
        <div className="section-box" style={{ margin: "1rem" }}>
          <h3>Interest Areas</h3>
          <ul style={{ textDecoration: "none", listStyle: "none", paddingLeft: 0 }}>
            {interests.map((item) => (
              <li key={item.label} style={{ marginBottom: "0.5rem" }}>
                {item.label}
                <button
                  onClick={() => navigate(`/department/${encodeURIComponent(item.label)}`)}
                  style={{ marginLeft: "10px" }}
                >
                  Go To Page
                </button>
                <button onClick={() => handleRemoveInterest(item.label)} style={{ marginLeft: "5px" }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3>Add More Interest Areas</h3>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {allInterestOptions
              .filter(label => !interests.find(item => item.label === label))
              .map(label => (
                <li key={label} style={{ marginBottom: "0.5rem" }}>
                  {label}
                  <button onClick={() => handleAddInterest(label)} style={{ marginLeft: "10px" }}>
                    Add
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="section-box" style={{ margin: "1rem" }}>
          <h3>Engagement Preferences:</h3>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {allPreferences.map((pref) => (
              <li key={pref}>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.includes(pref)}
                    onChange={() => togglePreference(pref)}
                  />
                  {" "}{pref}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleSavePreferences}>Update Preferences</button>
        </div>
      </div>

      <div>
        <UpcomingMeetings meetings={meetings} />
      </div>
    </div>
  );
}

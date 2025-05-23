import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpcomingMeetings from '../components/UpcomingMeetings';
import { auth, db } from "../firebase";
import { ref, set, get, child,update } from "firebase/database";
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
  const [experience, setExperience] = useState("");
  
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [homeowner, setHomeowner] = useState("");
  const [isEvanstonResident, setIsEvanstonResident] = useState("");


  const navigate = useNavigate();

  const updateInterestsInDB = async (updatedInterests) => {
    const user = auth.currentUser;
    if (user) {
      await update(ref(db, `users/${user.uid}`), {
        interests: updatedInterests
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
          setExperience(snapshot.val().experience || "");
          setGender(snapshot.val().gender || "");
          setRace(snapshot.val().race || "");
          setHomeowner(snapshot.val().homeowner || "");
          setIsEvanstonResident(snapshot.val().isEvanstonResident || "");
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
      await update(ref(db, `users/${user.uid}`), {
        zipcode: zip,
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
      await update(ref(db, `users/${user.uid}`), {
        preferences: preferences,
      });
      alert("✅ Preferences updated!");
    }
  };

  const handleSaveExperience = async () => {
    const user = auth.currentUser;
    if (user) {
      await update(ref(db, `users/${user.uid}`), {
        experience: experience
      });
      alert("Experience saved!");
    }
  };
  
  const handleSaveDemographics = async () => {
    const user = auth.currentUser;
    if (!isEvanstonResident) {
      alert("❌ Please confirm whether you are an Evanston resident.");
      return;
    }
    
    if (user) {
      await update(ref(db, `users/${user.uid}`), {
        gender,
        race,
        homeowner,
        isEvanstonResident
      });
      alert("✅ Demographics saved");
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

      <div className="section-box" style={{ margin: "1rem", width: "100%" }}>
        <h3>Previous Public Decision Making Experiences</h3>
        <textarea
          placeholder="Gone to a meeting, ran for office, or submitted comment"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            resize: "vertical",
          }}
        />
        <button onClick={handleSaveExperience} style={{ marginTop: "10px" }}>
          Save Experience
        </button>
      </div>
      <div className="section-box" style={{ margin: "1rem" }}>
        <h3>Demographic Information (Optional)</h3>

        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
          <option value="Other">Other</option>
        </select>

        <label>Race:</label>
        <select value={race} onChange={(e) => setRace(e.target.value)}>
          <option value="">Select race</option>
          <option value="Asian">Asian</option>
          <option value="Black or African American">Black or African American</option>
          <option value="Hispanic or Latino">Hispanic or Latino</option>
          <option value="White">White</option>
          <option value="Native American or Alaska Native">Native American or Alaska Native</option>
          <option value="Native Hawaiian or Pacific Islander">Native Hawaiian or Pacific Islander</option>
          <option value="Two or More Races">Two or More Races</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        <label><strong>Are you an Evanston resident? (Required)</strong></label>
        <select
          value={isEvanstonResident}
          onChange={(e) => setIsEvanstonResident(e.target.value)}
          required>
          <option value="">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label>Homeownership Status:</label>
        <select value={homeowner} onChange={(e) => setHomeowner(e.target.value)}>
          <option value="">Select status</option>
          <option value="Homeowner">Homeowner</option>
          <option value="Renter">Renter</option>
          <option value="Living with family/friends">Living with family/friends</option>
          <option value="Unhoused">Unhoused</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>

        <button onClick={handleSaveDemographics}>Save Demographics</button>
      </div>
      <div>
        <UpcomingMeetings meetings={meetings} />
      </div>
    </div>
  );
}

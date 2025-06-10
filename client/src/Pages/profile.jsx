import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UpcomingMeetings from '../components/UpcomingMeetings';
import { auth, db } from "../firebase";
import { ref, set, get, child,update } from "firebase/database";
// import "../css/Issue.css";
import NavBar from "../components/Navbar";
import TopBannerAlert from '../components/TopBannerAlert';
import "../css/profile.css";

const meetings = [
  {
    id: '1234567890',
    title: 'Weekly Team Sync',
    startTime: '2025-06-03T10:00:00',
    password: '123456',
  },
  {
    id: '9876543210',
    title: 'Project Planning',
    startTime: '2025-06-13T15:00:00',
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
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [newZipcode, setNewZipcode] = useState("");
  const [interests, setInterests] = useState(initialInterests);
  const [preferences, setPreferences] = useState([]);
  const [experience, setExperience] = useState("");
  
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [homeowner, setHomeowner] = useState("");

  const [showTopBanner, setShowTopBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("Username is taken!");
  const [bannerAlertType, setBannerAlertType] = useState("error");


  const navigate = useNavigate();
  const isValidUSZip = (zip) =>
    /^\d{5}$/.test(zip) && parseInt(zip, 10) >= 501 && parseInt(zip, 10) <= 99950;
  const updateInterestsInDB = async (updatedInterests) => {
    const user = auth.currentUser;
    if (user) {
      await update(ref(db, `users/${user.uid}`), {
        interests: updatedInterests
      });
    }
  };
  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in");
      return;
    }

    // Optional: Validate zipcode before saving
    if (!isValidUSZip(zipcode)) {
      setBannerAlertType("error");
      setBannerMessage("❌ Please enter a valid 5-digit US ZIP Code in range.")
      setShowTopBanner(true);
      // alert("❌ Please enter a valid 5-digit US ZIP Code in range.");
      return;
    }

    // check if username exists
    const isUsernameTaken = await checkUsernameExists(newUsername);
    if (isUsernameTaken){
      setBannerAlertType("error");
      setBannerMessage("Username is already taken! Please pick a different one.")
      setShowTopBanner(true);
      return;
    }

    try {
      await update(ref(db, `users/${user.uid}`), {
        username: newUsername,
        zipcode,
        gender,
        race,
        homeowner,
      });
      setUsername(newUsername);
      setBannerAlertType("info");
      setBannerMessage("✅ Profile saved successfully!")
      setShowTopBanner(true);
      // alert("✅ Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      setBannerAlertType("error");
      setBannerMessage("❌ Failed to save profile.")
      setShowTopBanner(true);
      // alert("❌ Failed to save profile.");
    }
  };

  const checkUsernameExists = async (usernameChecking) => {
    try {
      const snapUser = await get(ref(db, 'users/' + auth.currentUser.uid));
      if (snapUser.exists()){
        if (snapUser.val().username && snapUser.val().username === usernameChecking){
          return false; // this is users current username
        }
      }
    } catch (err) {
      console.error("Error getting username:", err);
    }

    const usersRef = ref(db, "users");
    try {
      const snap = await get(usersRef);
      if (snap.exists()){
        return Object.values(snap.val()).some(
          user => user.username && user.username.toLowerCase() === usernameChecking.toLowerCase()
        );
      }
      return false;
    } catch (err) {
      console.error("Error checking username:", err);
      return false;
    }
  }

  


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
          setUsername(snapshot.val().username || "");
          setZipcode(snapshot.val().zipcode || "");
          setInterests(snapshot.val().interests || []);
          setPreferences(snapshot.val().preferences || []);
          setExperience(snapshot.val().experience || "");
          setGender(snapshot.val().gender || "");
          setRace(snapshot.val().race || "");
          setHomeowner(snapshot.val().homeowner || "");
        }
        
      }
    });
    return () => unsubscribe();
  }, []);



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

  const onBannerClose = () => {
    setShowTopBanner(false);
    setBannerMessage("");
  };
  


  return (
    <div>
      <NavBar currentPage='/profile' />
    
      <div className="profile-container" style={{paddingTop: "2.5rem"}}>
        {/* <NavBar /> */}
        <div className="profile-header">
          <h1>Profile</h1>
        </div>

        <div className="section-box">
          <div className="profile-info-item">
            <strong>Email:</strong>
            <span>{email}</span>
          </div>

          <div className="profile-info-item">
            <strong>Username:</strong>
            {/* <span>{username}</span> */}
            <input
              type="text"
              placeholder={username}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>

          <div className="profile-info-item">
            <strong>Zipcode:</strong>
            <input
              type="text"
              placeholder="Enter zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
          </div>

          <div className="profile-info-item">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="profile-info-item">
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
          </div>

          <div className="profile-info-item">
            <label>Homeownership Status:</label>
            <select value={homeowner} onChange={(e) => setHomeowner(e.target.value)}>
              <option value="">Select status</option>
              <option value="Homeowner">Homeowner</option>
              <option value="Renter">Renter</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <button onClick={handleSaveProfile}>Save Profile</button>
        </div>


        <div className="profile-flex-layout">
          <div className="section-box interests-section">
            <h3>Interest Areas</h3>
            <div className="interest-grid">
              {interests.map((item) => (
                <div
                  key={item.label}
                  className="profile-interest-item"
                  onClick={() => navigate(`/department/${encodeURIComponent(item.label)}`)}
                >
                  {item.label}
                  <button onClick={(e) => {
                    e.stopPropagation(); // prevent navigation on button click
                    handleRemoveInterest(item.label);
                  }}>Remove</button>
                </div>
              ))}
            </div>

            <h3>Add More Interest Areas</h3>
            <div className="interest-grid">
              {allInterestOptions
                .filter(label => !interests.find(item => item.label === label))
                .map(label => (
                  <div key={label} className="profile-interest-item">
                    <span>{label}</span>
                    <button onClick={() => handleAddInterest(label)}>Add</button>
                  </div>
                ))}
            </div>
          </div>


          <div className="section-box preferences-section">
            <h3>Engagement Preferences:</h3>
            <ul>
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

        <div className="section-box">
          <h3>Previous Community Experiences</h3>
          <textarea
            placeholder="Gone to a meeting, ran for office, or submitted comment"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          <button onClick={handleSaveExperience}>Save Experience</button>
        </div>

        <div>
          <UpcomingMeetings meetings={meetings} />
        </div>

        { showTopBanner && (<TopBannerAlert 
                              message={bannerMessage} 
                              type={bannerAlertType} 
                              onClose={() => onBannerClose()}
                              />
        )}
      </div>
    </div>
  );
}

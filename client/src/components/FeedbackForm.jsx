import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";

const FeedbackForm = ({ department, onClose }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [askIdentity, setAskIdentity] = useState(false);

  const auth = getAuth();
  const db = getDatabase();

  const handleSubmit = () => {
    if (!text.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 1500);
      return;
    }

    setAskIdentity(true);
  };

  const submitToDatabase = async (isIdentified) => {
    setLoading(true);
    const user = auth.currentUser;
    const payload = isIdentified && user
      ? {
          userId: user.uid,
          email: user.email,
          message: text,
          timestamp: Date.now(),
        }
      : {
          message: text,
          anonymous: true,
          timestamp: Date.now(),
        };

    const path = `feedback/${department}`;
    await set(push(ref(db, path)), payload);

    setLoading(false);
    setText("");
    setAskIdentity(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {showSuccess ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <h3>🎉 Thank you for your feedback!</h3>
          </div>
        ) : (
          <>
            <h3>Submit Feedback</h3>
            <textarea
              style={styles.textarea}
              placeholder="Write your feedback..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div style={styles.buttons}>
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button onClick={onClose}>Cancel</button>
            </div>
            {showError && (
              <div style={styles.errorBox}>⚠️ Feedback cannot be empty.</div>
            )}
            {askIdentity && (
              <div style={styles.confirmBox}>
                <p>
                  Do you want to submit this feedback with your name and email?
                  If you choose "Yes", your user ID and email will be recorded.
                </p>
                <div style={styles.buttons}>
                  <button onClick={() => submitToDatabase(true)}>Yes</button>
                  <button onClick={() => submitToDatabase(false)}>No</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    marginTop: "10px",
    marginBottom: "20px",
    resize: "vertical",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
  errorBox: {
    marginTop: "10px",
    backgroundColor: "#ffe5e5",
    color: "#cc0000",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "14px",
    textAlign: "center",
  },
  confirmBox: {
    marginTop: "16px",
    backgroundColor: "#f0f4ff",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#333",
  },
};

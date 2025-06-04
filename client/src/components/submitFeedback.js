// src/components/submitFeedback.js
import { ref, push } from "firebase/database";
import { db, auth } from "../firebase"; 

export const submitFeedback = (department, feedbackText) => {
  const uid = auth.currentUser?.uid || "anonymous";
  const feedbackRef = ref(db, `${department}/Feedback`);

  const feedbackData = {
    userId: uid,
    content: feedbackText,
    timestamp: Date.now(),
  };

  return push(feedbackRef, feedbackData)
    .then(() => {
      console.log("✅ Feedback submitted");
    })
    .catch((err) => {
      console.error("❌ Failed to submit feedback:", err);
    });
    // return new Promise((resolve) => {
    //     console.log(`✅ (mock) Feedback submitted to ${department}: ${feedbackText}`);
    //     setTimeout(resolve, 500); //
    //   });
};

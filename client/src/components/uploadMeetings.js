import { ref, push } from "firebase/database";
import { auth, db } from "../firebase"; // ⚠️ 路径根据你项目结构调整

export const uploadMeetings = () => {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to upload meetings.");
    return;
  }

  const meetings = [
    {
      id: "1234567890",
      title: "Weekly Team Sync",
      startTime: "2025-05-13T30:00:00",
      password: "123456",
    },
    {
      id: "9876543210",
      title: "Project Planning",
      startTime: "2025-05-13T15:00:00",
      password: "654321",
    },
  ];

  const meetingRef = ref(db, `users/${user.uid}/zoomMeetings`);
  meetings.forEach((meeting) => {
    push(meetingRef, meeting);
  });

  console.log("✅ Zoom meetings uploaded");
};

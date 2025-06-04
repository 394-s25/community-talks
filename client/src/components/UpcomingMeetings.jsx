// components/UpcomingMeetings.jsx
import React from 'react';

const UpcomingMeetings = ({ meetings }) => {
  const openZoomMeeting = (meetingId, password) => {
    const url = `https://zoom.us/j/${meetingId}?pwd=${password}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>📅 Upcoming Zoom Meetings</h2>
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          style={{
            marginBottom: '20px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '10px',
          }}
        >
          <h4>{meeting.title}</h4>
          <p>🕙 {new Date(meeting.startTime).toLocaleString()}</p>
          <button onClick={() => openZoomMeeting(meeting.id, meeting.password)}>
            Join Meeting
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMeetings;

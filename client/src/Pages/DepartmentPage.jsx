import React, {useState} from 'react';
import UpcomingMeetings from '../components/UpcomingMeetings';
import FeedbackForm from "../components/FeedbackForm";

const meetings = [
    {
      id: '1234567890',
      title: 'Weekly Team Sync',
      startTime: '2025-05-13T20:00:00',
      password: '123456',
    },
    {
      id: '9876543210',
      title: 'Project Planning',
      startTime: '2025-05-13T15:00:00',
      password: '654321',
    },
];



export default function DefaultDepartmentPage({url}){
    // scrape data from url

    return (
        <div style={{ display: 'flex', height: '100vh', margin: '1rem' }}>
            {/* Left: Issue content */}
            <div style={{ flex: 3, padding: '20px', overflowY: 'auto' }}>
            <h1>Issue Page</h1>
            <p>This is where your issue content goes.</p>

            
            <button onClick={() => setShowFeedback(true)}>
                📝 Submit Feedback
            </button>

            {/* 🔘 Feedback Modal */}
            {showFeedback && (
                <FeedbackForm
                department="Administration and Public Works"
                onClose={() => setShowFeedback(false)}
                />
            )}
            </div>

            {/* Right: Zoom meetings */}
            <div style={{ flex: 2, borderLeft: '1px solid #ddd', overflowY: 'auto' }}>
            <UpcomingMeetings meetings={meetings} />
            </div>

        </div>
    );
}


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import UpcomingMeetings from "../components/UpcomingMeetings";
import FeedbackForm from "../components/FeedbackForm";
import "../css/Issue.css";
import { parse, format, isValid, addHours } from "date-fns";


const isValidUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};


export default function IssuePage() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const readableCategory = decodeURIComponent(category);
  const readableName = decodeURIComponent(slug.replace(/-/g, " "));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, `detail/${readableCategory}/${slug}`));
        if (snapshot.exists()) {
          setDetailData(snapshot.val());
        } else {
          setDetailData(null);
        }
      } catch (err) {
        console.error("❌ Failed to load detail:", err);
      }
    };
    fetchData();
  }, [category, slug]);

  const meetings = [
    {
      id: "1234567890",
      title: "Weekly Team Sync",
      startTime: "2025-05-13T20:00:00",
      password: "123456",
    },
  ];

  const formatKey = (key) =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="issue-page">
      <div className="issue-left">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <h1 className="page-title">{readableName.replace(/\b\w/g, l => l.toUpperCase())}</h1>


        <div className="section-card">
          <div className="section-header">
            <span role="img" aria-label="clipboard">📋</span>
            <h2 className="section-title-large">DUTIES & RESPONSIBILITIES</h2>

          </div>
          {detailData ? (
            <div className="section-content">
              {detailData.description
                .split(/\n+/)
                .filter(p => p.trim() !== "")
                .map((para, i) => (
                  <p key={i} className="section-paragraph">{para.trim()}</p>
                ))}
            </div>
          ) : (
            <p className="section-paragraph">Loading details...</p>
          )}

        </div>

        {detailData?.members && (
          <div className="section-box">
            <h2>👫 Members</h2>
            <ul>
              {detailData.members.map((m, i) => (
                <li key={i}>
                  {m.profileLink ? (
                    <a href={m.profileLink} target="_blank" rel="noopener noreferrer">
                      <strong>{m.name}</strong>
                    </a>
                  ) : (
                    <strong>{m.name}</strong>
                  )}
                  {m.role ? ` – ${m.role}` : ""} {m.term ? ` (${m.term})` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        {detailData?.staff && (
          <div className="section-box">
            <h2>👔 Staff</h2>
            <ul className="staff-list">
              {detailData.staff.map((staff, i) => {
                // object
                if (typeof staff === "object" && staff !== null) {
                  return (
                    <li key={i}>
                      <strong>{staff.name}</strong>
                      {staff.email && (
                        <>
                          {" – "}
                          <a href={`mailto:${staff.email}`}>{staff.email}</a>
                        </>
                      )}
                    </li>
                  );
                }
                // string
                return <li key={i}>{staff}</li>;
              })}
            </ul>
          </div>
        )}


        {detailData?.recordings && (
          <div className="section-box">
            <h2>📽️ Recordings</h2>
            <div className="recording-list">
              {detailData.recordings.map((rec, i) => {
                let videoId = "";
                try {
                  const urlObj = new URL(rec.link);
                  videoId =
                    new URLSearchParams(urlObj.search).get("v") ||
                    urlObj.pathname.split("/").pop();
                } catch (_) { }

                return (
                  <div key={i} className="recording-item">
                    <p>{rec.date || rec.title}</p>
                    <div className="video-wrapper">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={rec.date}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {detailData &&
          Object.entries(detailData).map(([key, value]) => {
            if (["description", "virtualMeeting", 'lastUpdated', "staff", "name", "members", 'meetings', "recordings", "meetingPlace", "meetingSchedule"].includes(key)) return null;


            if (Array.isArray(value)) {
              return (
                <div key={key} className="section-box">
                  <h2>{formatKey(key)}</h2>
                  <ul>
                    {value.map((v, i) => (
                      <li key={i}>{typeof v === "string" ? v : JSON.stringify(v)}</li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <div key={key} className="section-box">
                <h2>{formatKey(key)}</h2>
                {/* <p>{typeof value === "string" ? value : JSON.stringify(value)}</p>
                 */}
                {typeof value === "string" ? (
                  isValidUrl(value) ? (
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      {value}
                    </a>
                  ) : (
                    <p>{value}</p>
                  )
                ) : (
                  <p>{JSON.stringify(value)}</p>
                )}


              </div>
            );
          })}

        <div className="section-box">
          <h2>💬 Feedback</h2>
          <button
            onClick={() => setShowFeedback(true)}
            className="submit-btn"
          >
            Submit Feedback
          </button>
        </div>

        {showFeedback && (
          <FeedbackForm
            department={readableName}
            onClose={() => setShowFeedback(false)}
          />
        )}
        {detailData?.lastUpdated && (
          <div style={{ fontSize: "0.9em", color: "#666", marginTop: "1em", paddingLeft: "0.5em" }}>
            Last updated: {new Date(detailData.lastUpdated).toLocaleString()}
          </div>
        )}
      </div>



      <div className="issue-right">
        {(detailData?.meetingSchedule || detailData?.meetingPlace) && (
          <div className="section-box">
            <h2>📅 Upcoming Meetings</h2>
            <div className="meeting-info-card">
              {detailData.meetingSchedule && (
                <p>
                  <strong>🗓️ Schedule:</strong> {detailData.meetingSchedule}
                </p>
              )}
              {detailData.meetingPlace && (
                <p>
                  <strong>📍 Location:</strong> {detailData.meetingPlace}
                </p>
              )}
            </div>
          </div>
        )}


        {detailData?.virtualMeeting && (
          <div className="section-box">
            <h2>🖥️ Virtual Meeting Access</h2>

            {/* Public Comment Section */}
            {detailData.virtualMeeting.publicComment && (
              <div className="virtual-section">
                <h3>📝 Public Comment</h3>
                <div className="virtual-card">
                  {Array.isArray(detailData.virtualMeeting.publicComment.methods) && (
                    <p>
                      <strong>How to Comment:</strong>{" "}
                      {detailData.virtualMeeting.publicComment.methods.join(", ")}
                    </p>
                  )}
                  {detailData.virtualMeeting.publicComment.signUpForm && (
                    <p>
                      <strong>Sign-Up Form:</strong>{" "}
                      <a
                        href={detailData.virtualMeeting.publicComment.signUpForm}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Submit via Form
                      </a>
                    </p>
                  )}
                  {detailData.virtualMeeting.publicComment.contact && (
                    <p>
                      <strong>Contact:</strong>{" "}
                      <a href={`tel:${detailData.virtualMeeting.publicComment.contact}`}>
                        {detailData.virtualMeeting.publicComment.contact}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Watch Options Section */}
            {Array.isArray(detailData.virtualMeeting.watchOptions) &&
              detailData.virtualMeeting.watchOptions.length > 0 && (
                <div className="virtual-section">
                  <h3>📺 How to Watch</h3>
                  <div className="watch-grid">
                    {detailData.virtualMeeting.watchOptions.map((opt, idx) => (
                      <div key={idx} className="virtual-card">
                        <p>
                          <strong>{opt.platform}</strong>{" "}
                          {opt.type && <span>({opt.type})</span>}
                        </p>
                        {opt.channel && (
                          <p>
                            <strong>Channel:</strong> {opt.channel}
                          </p>
                        )}
                        {opt.instructions && (
                          <p>
                            <strong>Instructions:</strong>{" "}
                            <em>{opt.instructions}</em>
                          </p>
                        )}
                        {opt.url && (
                          <p>
                            <strong>Watch Online:</strong>{" "}
                            <a
                              href={opt.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {opt.url}
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}


        {detailData?.meetings && detailData.meetings.length > 0 && (
          <div className="section-box">
            <h2>📌 Scheduled In-Person Meetings</h2>
            <ul className="meeting-list">
              {detailData.meetings.map((meeting, i) => {
                const [rawStart, rawEnd] = (meeting.time || "").split(" - ");
                const dateStr = meeting.date;
                const location = meeting.location || "";
                const title = meeting.title || "Meeting";

                let startDateTime = null;
                let endDateTime = null;
                let calendarUrl = "#";
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

                // bagging
                if (dateStr && rawStart) {
                  startDateTime = parse(`${dateStr} ${rawStart}`, "yyyy-MM-dd h:mm a", new Date());

                  if (isValid(startDateTime)) {
                    // otherwise, default to 1 hour
                    if (rawEnd) {
                      endDateTime = parse(`${dateStr} ${rawEnd}`, "yyyy-MM-dd h:mm a", new Date());
                      if (!isValid(endDateTime)) {
                        endDateTime = addHours(startDateTime, 1);
                      }
                    } else {
                      endDateTime = addHours(startDateTime, 1);
                    }

                    // google calendar link
                    calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${format(startDateTime, "yyyyMMdd'T'HHmmss")}/${format(endDateTime, "yyyyMMdd'T'HHmmss")}&location=${encodeURIComponent(location)}`;
                  }
                }

                return (
                  <li key={i} className="meeting-item" style={{ marginBottom: "1em" }}>
                    <div className="meeting-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{title}</strong>
                      <div style={{ display: "flex", gap: "0.5em" }}>
                        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-map">
                          📍 Show on Map
                        </a>
                        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn btn-calendar">
                          📅 Add to Calendar
                        </a>
                      </div>
                    </div>
                    <p style={{ margin: "0.3em 0 0 0.5em" }}>
                      <span>📆 {meeting.date}</span><br />
                      <span>🕒 {meeting.time || "Time not specified"}</span><br />
                      <span>📌 {location}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {detailData &&
          !detailData.meetingSchedule &&
          !detailData.meetingPlace &&
          !detailData.virtualMeeting &&
          (!detailData.meetings || detailData.meetings.length === 0) && (
            <div style={{ color: "#909", fontStyle: "italic", padding: "9em" }}>
              No meeting-related information available.
            </div>
          )}

      </div>


    </div>
  );
}

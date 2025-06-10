import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../css/HomePage.css";
import "../css/calendar.css";

export default function CalDayBanner({day, divClass, divStyle={}}){
    
    return (
        <div className={divClass} style={divStyle}>
            <h2 style={{color:"#1f2937"}}>{day.dateText}</h2>
            <ul className="day-events">
                {day.events.length === 0 ? 
                    (<div style={{display: "flex", justifyContent: "center", alignItems:"center", margin: "0 auto"}}><h3>No events</h3></div>)
                    :
                day.events.map((event) => (
                    <li key={day.date + event.date+event.title} 
                        onClick={() => <Link to={event.link}
                        style={{backgroundColor: "#e6ecf7 !important"}}/>}>
                        <p>{event.time === "" ? <></> : event.time}</p>
                        <Link to={event.link}><p>{event.title}</p></Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
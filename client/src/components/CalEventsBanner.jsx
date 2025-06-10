// pulls from the backend server to get the current month info
import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { ref, push, get, set, update } from "firebase/database";
import CalDayBanner from './CalDayBanner'; // the card for each day in the banner
import NavBar from './Navbar';
import PageLoader from "./PageLoader";
import "../css/HomePage.css";
import "../css/calendar.css";

export default function CalEventsBanner(){
    const [calServerData, setCalServerData] = useState([]);
    const [runServer, setRunServer] = useState(false);
    const [weekData, setWeekData] = useState([]);
    const today = new Date();
    const months = ["January", "February", "March",  "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [month, setMonth] = useState(months[today.getMonth()]);
    const year = today.getFullYear();
    const range = (n) => [...Array(n).keys()];
    const [currBannerDivIdx, setCurrBannerDivIdx] = useState(0);
    const [isBannerPaused, setIsBannerPaused] = useState(false);
    const localHostPath = "http://localhost:5001/api/data";
    // const firebaseHttpPath = "https://evanstoncommunitytalks.cloudfunctions.net/api/api/data"
    const serverPath = localHostPath;

    useEffect(() => {
        // only run the fetching from backend every few days
        // else just pull from database
        
        if (runServer){
            fetch(serverPath)
                .then(res => res.json())
                .then(data => {
                    setMonth(data[0].month);
                    setCalServerData(data);
                    handleSetWeekData(data);
                })
                .catch(err => console.error("Error fetch from backend server:", err));
        } else {
            getCalWeekDbData();
        }

    },[]);

    useEffect(() => {
        setCurrBannerDivIdx(0);
    }, [weekData]);

    useEffect(() => {
        // start banner carousel
        if (!weekData || weekData.length === 0 || isBannerPaused) return;
        const timer = setInterval(() => {
            setCurrBannerDivIdx((prev) => (prev + 1) % weekData.length);
        }, 4000);

        return () => clearInterval(timer);
    },[currBannerDivIdx, weekData, isBannerPaused]);

    const handleSetWeekData = (calData) => {
        const currWeek = [
            {'Monday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }
            }, 
            {'Tuesday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}, 
            {'Wednesday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}, 
            {'Thursday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}, 
            {'Friday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}, 
            {'Saturday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }},
            {'Sunday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}
        ];

        // figure out what day of the week today is
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // Sunday - Saturday : 0 - 6
       
        const yr = today.getFullYear();

        const date = new Date();

        // based on today get the full week 
        const dayOfWeek = date.getDay(); //e.g. 0 == Sunday
        const toMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(date);
        monday.setDate(date.getDate() + toMonday);
        
        const currDayOfWeek = weekdays[dayOfWeek];
        const currDayIdx = dayOfWeek - 1 === -1 ? 6 : dayOfWeek - 1;
        

        // [day of week] [month] [weekday]
        currWeek[currDayIdx][currDayOfWeek].date = currDayOfWeek + ", " + month + " " + date.getDate();
        
        // update their date so it reads dayOfWeek Month Day
        const foundDays = {};
        for (let i = 0; i < 7; i++){
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            // convert into [day of week] [month] [weekday] (e.g. Wednesday June 4th)
            const dateNum = day.getDate();
            const newDay = weekdays[day.getDay()] + ", " + month + " " + dateNum + " " + yr;
            const weekDay = weekdays[day.getDay()];
            // const weekDay = weekdays[i + 1 === 7 ? 0 : i + 1];
            // currWeek[weekday idx (0 === Monday)][weekdayStr (Monday,Tuesday)]
            currWeek[i][weekDay].date = dateNum;
            currWeek[i][weekDay].dateText = newDay;
            foundDays[dateNum] = [i, weekDay];
        }

        
        // extract only those days from the calData
        for (let i = 1; i < calData.length; i++){
            if (calData[i].date in foundDays){
                currWeek[foundDays[calData[i].date][0]][foundDays[calData[i].date][1]].events = calData[i].events;
            }
        }


        // setWeekData with the new dict obj
        setWeekData(currWeek);
        updateCalDatabase(currWeek);
    }

    const updateCalDatabase = async (calData) => {
        /* db structure
        Calendar
            Monday
                Date (the weekday number, e.g. May 23 would be 23)
                dateText (weekday, month day)
                Events
                    [
                        Time
                        Title
                        Link 
                    ]
        */
       try {
        for (let i = 0; i < calData.length; i++){
            const key = Object.keys(calData[i])[0];
            
            const dbRefPath = 'calendar/' + key.trim();
            const id = set(ref(db, dbRefPath), {
                date: calData[i][key].date,
                dateText : calData[i][key].dateText
            })
            
            for (let j = 0; j < calData[i][key].events.length;j++){
                push(ref(db, dbRefPath + "/events"), {
                    time: calData[i][key].events[j].time,
                    title: calData[i][key].events[j].title,
                    link: calData[i][key].events[j].link
                });
            }
        }

        // })
       } catch (err) {
        console.error("Error updating database at /calendar:", err);
       }

    }

    const getCalWeekDbData = async () => {
        const currWeek = [
            {'Monday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }
            }, 
            {'Tuesday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}, 
            {'Wednesday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}, 
            {'Thursday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}, 
            {'Friday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}, 
            {'Saturday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }},
            {'Sunday': 
                {
                    "date": 0,
                    "dateText": "",
                    "events": []
                }}
        ];

        try {
            for (let i = 0; i < currWeek.length; i++){
                const key = Object.keys(currWeek[i])[0];
                const dbRefPath = 'calendar/' + key.trim();
                const snap = await get(ref(db, dbRefPath));
                if (snap.exists()){
                    const data = snap.val();
                    currWeek[i][key].date = data.date;
                    currWeek[i][key].dateText = data.dateText;
                    if (data.events){
                        const eventsKeys = Object.keys(data.events);
                        // get event data
                        for (let j = 0; j < eventsKeys.length; j++){
                            currWeek[i][key].events.push(data.events[eventsKeys[j]]);
                        }
                    }
                } else  {
                    console.warn("No data at", dbRefPath);
                }
            }
            setWeekData(currWeek);
    
           } catch (err) {
            console.error("Error retrieving from database at /calendar:", err);
           }

    }

    const nextSlide = (i) => {
        const nextIdx = (currBannerDivIdx + i + weekData.length) % weekData.length;
        setCurrBannerDivIdx(nextIdx);
    }

    const goToBannerSlide = (idx) => {
        setCurrBannerDivIdx(idx);
    }

    const toggleCurrBanner = (idx) => {
        let newIdx = idx;
        if (idx > 6) newIdx = 0;
        else if (idx < 0) newIdx = 6;
        

        setCurrBannerDivIdx(newIdx);
        goToBannerSlide(newIdx);
    }
    

    const bannerCarousel = () => {
        let i;
        let x = document.getElementsByClassName("cal-slide");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        const newIdx = currBannerDivIdx + 1;
        if (newIdx > x.length) {setCurrBannerDivIdx(0)}
        x[newIdx-1].style.display = "block";
        setTimeout(bannerCarousel, 3000);
    }


    return (
        <div className="calendar-banner-container calendar-banner-content homepage-column"
            style={{background:"rgb(247, 247, 247)"}}
            onMouseEnter={() => setIsBannerPaused(true)}
            onMouseLeave={() => setIsBannerPaused(false)}>
            <h1 style={{fontWeight: 600, color:"#1f2937", borderBottom:"1px solid #e5e7eb", paddingBottom:"0.5rem"}}>This week's events</h1>
            <div className="banner-slide-container">
                {weekData.map((data, idx) => (
                    <CalDayBanner 
                        key={idx} 
                        day={data[Object.keys(data)[0]]}
                        divClass = {`cal-slide banner ${idx === currBannerDivIdx ? 'show' : ''}`}
                        divStyle={{display: idx === currBannerDivIdx ? 'block' : 'none', background:"rgb(247, 247, 247)"}}
                        />)
                )}

            </div>
            <div className="banner-controls" style={{width:"100%"}}>
                <div className="left banner-nav-button" onClick={() =>  toggleCurrBanner(currBannerDivIdx - 1)}>&#10094;</div>
                {range(7).map((i) => (
                    <span key={i} className={i === currBannerDivIdx ? 'banner-circle-nav active'  : 'banner-circle-nav transparent'} onClick={() => toggleCurrBanner(i)}></span>
                ))}
                <div className="right banner-nav-button" onClick={() =>  toggleCurrBanner(currBannerDivIdx + 1)}>&#10095;</div>

            </div>
        </div>
    );
};
// pulls from the backend server to get the current month info
import React, { useState, useEffect } from 'react';

export default function CalEvents(){
    const [calServerData, setCalServerData] = useState([]);
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [msg, setMsg] = useState('');
    const serverPath = "http://localhost:5001/api/data";

    useEffect(() => {
        fetch(serverPath)
            .then(res => res.json())
            .then(data => {
                console.log("Server Data:", data);
                setMonth(data[0].month);
                console.log("Month:", data[0].month);
                setCalServerData(data);
                // setCalServerData(data);
            })
            .catch(err => console.error("Error fetch from backend server:", err));
    },[]);

    return (
        <div>
            <p>{month}</p>
            <div>
                {/* {calServerData} */}
            </div>
        </div>
    );
};
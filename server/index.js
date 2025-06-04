const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors"); //for headers

const app = express();
const PORT = 5001;
const BASE_URL = `https://www.cityofevanston.org/`;
const URL = `https://www.cityofevanston.org/about-evanston/events`;
const header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                  '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://google.com/',
};
const calEvents = [] //first entry is the month

app.use(cors({
    origin:"http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
// serve the data to the path /api/data

// app.get('/api/data', (req, res) => {
//     res.json({message: "Hello from server!"});
// })


app.get("/api/data", async (req, res) => {
    try {
        
        const response = await axios.get(URL, {headers: header});
        const html = response.data;
        const $ = cheerio.load(html);
        // get the month
        const monthCls = $('.calendar-mini-grid-title'); 
        let currentMonth = null;
        const monthNames = {1:"January", 2: "February", 3:"March", 4: "April", 5: "May", 
                            6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 
                            11: "November", 12: "December"};

        if (!monthCls){
            console.warn("Could not find the calendar month grid section");
            currentMonth = new Date().getMonth().toString();
        } else {
            // cal month exists, extract it
            const rawDate = monthCls.find(".current_month_title").text().trim();
            const rawMon = monthCls.find(".current_month_title").text().trim().split(" ")[0];
            const mon = new Date(rawDate);
            currentMonth = monthNames[mon.getMonth() + 1];
            // getMonth returns the month number (0-idx) from a new Date obj
        }

        // console.log(monthCls.find(".current_month_title").children());
        // console.log("Curr month:",currentMonth);
        calEvents.push({month: currentMonth});

        //
        // get calendar events
        //

        // let calId = $("#events_widget_50_2041_502 .calendar-mini-grid-grid");
        // const calHtml = calId.html();
        // console.log('calHtml exists?', !!calHtml);
        // console.log('calHtml length:', calHtml?.length);
        
        // div.calendar_items
        //  div.calendar_item
        //      span.calendar_eventtime
        //      a.calendar_eventlink
        const calHtml = $(".calendar-mini-grid-grid").first().html();
        if (!calHtml) {
            console.error("❌ Could not find calendar HTML — check selector.");
            return;
        }
        const $$ = cheerio.load(calHtml);
        let currentDay = null;
        let prevSiblings = [];
        $$("div.calendar_items").each((i, elem) => {
            let prev = elem.prev;
            prevSiblings = [];

            while (prev) {
                if (prev.type === 'text') {
                    const nums = prev.data.match(/\d+/g);
                    if (nums) prevSiblings.push(...nums);
                } else if (prev.name === 'div' && $$(prev).hasClass('calendar_items')) {
                    break; // Stop at previous .calendar_items
                }
                prev = prev.prev;
            }

            if (prevSiblings.length > 0) {
                currentDay = prevSiblings[prevSiblings.length - 1]; // Use the last day number found
            }

            if (!currentDay) return; // skip if no day
          
            const day = {
              date: currentDay,
              events: []
            };
          
            const $elem = $$(elem);
            $elem.find(".calendar_item").each((j, ev) => {
              const time = $$(ev).find(".calendar_eventtime").text().trim();
              const evLink = $$(ev).find(".calendar_eventlink");
              const title = evLink.attr("title")?.trim();
              const href = evLink.attr("href");
              day.events.push({ time, title, link:  BASE_URL + href });
            });
          
            calEvents.push(day);
          });

        //console.log($$.html());
        // res.send(calEvents);
        res.json(calEvents);
    } catch (err) {
        console.error("Error fetching data:", err.message);
        res.status(500).send("Error fetching data")
    }
});


app.listen(PORT, () => {
    console.log(`Server actively running at http://localhost:${PORT}`);
})
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

// make a server with express
//  tell it to go to the site and get the informatioin

// const axios = require('axios');
// const cheerio = require("cheerio");

const BASE_URL = 'https://www.cityofevanston.org';
const header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                  '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://google.com/',
  };

async function pupCrawl(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(BASE_URL, {waitUntil: 'networkidle2'});
    const content = await page.content();
    console.log(content);
    await browser.close();
}

//pupCrawl();

// this works
// axios.get(BASE_URL + `/government/boards-commissions-and-committees`, {
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
//                     '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//       'Accept-Language': 'en-US,en;q=0.5',
//       'Referer': 'https://google.com/',
//     }
//   })
//   .then(response => console.log(response.data))
//   .catch(error => console.error(error.response.status));


async function crawlPage(path = '/home') {
  try {
    const { data } = await axios.get(BASE_URL + path, {
        headers: header
    });
    const $ = cheerio.load(data);

    console.log(`Crawled: ${BASE_URL}${path}`);
    
    // Example: Log all links on the page
    $('a').each((i, link) => {
      const href = $(link).attr('href');
      if (href && href.startsWith('/')) {
        console.log('Found internal link:', href);
      }
    });
  } catch (error) {
    console.error('Error crawling page:', error.message);
  }
}

//crawlPage();


// get the page with url (static for now)
// const url = "https://www.cityofevanston.org/government/boards-commissions-and-committees";
// axios.get(url)
//     .then(res => {
//         console.log(res.data);
//     })
//     .catch(err => {
//         console.error("Error fetching the page:", err);
//     });

async function scrapeBoardMemberNames() {
    try {
        // Step 1: Get the main page
        const { data: html } = await axios.get(`${BASE_URL}/government/boards-commissions-and-committees`, {headers: header});
        const $ = cheerio.load(html);
        const links = [];
    
        // Step 2: Extract links to individual boards/commissions
        $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/government/boards-commissions')) {
            links.push(BASE_URL + href);
        }
        });
    
        // Step 3: Visit each link and scrape member names
        for (const link of links.slice(0, 3)) { // limit for testing
        try {
            const { data: boardHtml } = await axios.get(link);
            const $$ = cheerio.load(boardHtml);
    
            console.log(`\nBoard URL: ${link}`);
            $$('li, p, td').each((_, el) => {
            const text = $$(el).text().trim();
            if (text.match(/^[A-Z][a-z]+\s[A-Z][a-z]+/)) { // crude name matcher
                console.log('Member:', text);
            }
            });
        } catch (err) {
            console.error('Error loading board page:', link, err.message);
        }
        }
    
    } catch (err) {
        console.error('Failed to scrape:', err.message);
    }
}
    
scrapeBoardMemberNames();
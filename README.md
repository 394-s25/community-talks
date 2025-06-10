<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!-- This template was taken from the Best-README-Template
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/394-s25/community-talks/tree/main">
    <img src="client/public/logoicon.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Community Talks</h3>

  <p align="center">
    project_description:
    <div>
      <p>The CommunityTalks app is an open community feedback and forum app. CommunityTalks is a one stop app for Evanston community members to find information, stay informed, and give their feedback on Evanston departments, committees, issues, and other areas of interest. The app’s homepage has a few committees page links to learn more about each committee as well as a side nav for committee navigation and a top nav for page navigation. The app has three prominent pages: home page, community forum, and the profile.</p>
    </div>
    <br />
    <a href="https://github.com/394-s25/community-talks/tree/main"><strong>Explore the github repo »</strong></a>
    <br />
    <br />
    <a href="https://evanstoncommunitytalks.web.app/home">View Website</a>
    &middot;
    &middot;
    <a href="https://github.com/394-s25/community-talks/tree/main/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installating-the-app">Installation</a></li>
        <li><a href="#running-the-app">Running the app</a></li>
      </ul>
    </li>
    <li><a href="#app-setup">App Setup</a></li>
    <li><a href="#firebase-setup">Firebase Setup</a></li>
    <li><a href="#third-party">Third Party Connections</a></li>
    <li><a href="#bugs">Bugs</a></li>
    <li><a href="#top-contributors">Contributing Developers</a></li>
    <li><a href="#links">Links</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project


Here's a blank template to get started. To avoid retyping too much info, do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`, `project_license`

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* [![Javascript][Javascript.js]]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![FontAwesome][Fontawesome.com]][FontAwesome-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites/Dependencies

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```
For frontend (client folder)
* npm
  ```sh
  npm install firebase
  npm install --save @fortawesome/fontawesome-svg-core
  npm install --save @fortawesome/react-fontawesome
  npm install --save @fortawesome/free-solid-svg-icons
  npm install --save @fortawesome/free-regular-svg-icons
  npm install --save @fortawesome/free-brand-svg-icons
  npm install react-select
  npm install react-bootstrap bootstrap
  npm i bootstrap@5.3.6
  npm install
  ```

For backend (server folder)
* npm
  ```sh
  npm install express cors axios
  ```


### Installating the app

1. Clone the repo
   ```sh
   git clone https://github.com/394-s25/community-talks/tree/main
   ```
3. Install NPM packages in both the root, client, and server folders
   ```sh
   npm install
   ```
4. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```
5. Set up firebase congig in the client/src location. (See 'How to setup Firebase' below for more details)

### Running the app
To Run the app locally
1. navigate to the client folder and run the following commands
  ```sh
  cd client
  npm run build
  npm run start
```
2. *To deploy the app to the webpage run the following command in the root of the client folder:
   ```sh
   firebase deploy
   ```
3. To run the app concurrently with the server on a local machine, navigate to the root of the project, and then run: npm start


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- How the app is setup  -->
## App Setup

Home page:
* We setting some pages to make sure it has detail information from gov webpage.
* The first 2 kinds of communities are our designed pages and manually add data.   
* Since the government's website cannot be downloaded through scripts, we directly connect to the remaining content using external links. We found a way to bypass it by creating a server API, but we only pulled the calendar information. It should be possible to use the server to get the desired information off of the specific committee sites
  
CalEventsBanner:
* The banner which shows the events of the week, pulled from the cityofevanston/calendar page. The runServer variable is default set to false, when it is set to *true* on the next page reload it will call the backend server and update the database information.
* To update the information, do the following steps:
1.  Navigate to the root of the project and run the following commands:
   ```sh
   cd ..
   npm install concurrently
   ```
3. Navigate to server folder and run the following commands:
   ```sh
   npm init -y
   npm install express cors
   node index.js
   ```
5. Navigate back to the root of the project and run the following commands:
   ```sh
   cd ..
   npm start
   ```
7. In the terminal, the link to the local host site should appear. Open it and it will run the CalEventsBanner, which is on the homepage
8. _*Note:*_ If there are changes to the backend (server/index.js) then you will need to run node index.js in the server folder, before running npm run build in the client folder

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- How to set up Firebase: where to create an account, where to put configuration data, how to import starting data into the database -->

## Firebase Setup
The app is run under the firebase project 'community-talks' with the email communitytalksapp@gmail.com (the email is sent separately for security)

To run firebase in the app, create a file called firebase.js and put it in the client/src folder. It should contain the firebase configuration file (this information is also found in firebase project overview or realtime database). This file was sent alongside the delivered materials.

The app uses information from the database to populate the home page and the committee issue pages. After pulling the code, will need to add testing dataset(this test data is in the provided JSON file):
* Going to “/function” and push every buttons.
* All testing dataset will add to your firebase database


### Third-Party Connections
The app uses icons from Font Awesome at this Fontawesome kit: https://kit.fontawesome.com/9b807e0756.js 

The app also uses cheerio and axios in the server for fetching and parsing HTML data (from the cityofevanston page). All in compliance to the cityofevanstons web scraping policies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- Known Bugs -->
## Bugs

In order of easy to fix to difficult

* The search bar is buggy and wont allow searching, but *when it works* should allow searching by tag and title
* The top navigation bar appears blank unless a bootStrap color class like navbar-light is applied. Links are clickable but text may be invisible without it.
* The server works through local hosting API, the fetching from that API will only run when manually called for in client/src/components/CalEventsBanner.jsx  which is controlled by the runServer variable to fetch from the respective serverPath.
* * To get it to work from non-local host nor a third party API, you can initialize firebase HTTP functions, but it requires a paid plan (the blaze plan) to run. Those functions will only run when manually called for in client/src/components/CalEventsBanner.jsx . which is controlled by the runServer variable to fetch from the respective serverPath
* The interests on the profile are not connected to anything to give it updates, but all preferences are saved to the database

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<p><a href="https://github.com/Minxin-Shi">Minxin Shi</a></p>
<p><a href="https://github.com/zoryah-gray">Zoryah Gray</a></p>
<p><a href="https://github.com/Shuyang-Yu-808">Shuyang Yu</a></p>
<p><a href="https://github.com/pan1018">Yuyang Pan</a></p>

<!-- CONTACT -->
## Links

Project Link: [https://github.com/394-s25/community-talks/tree/main](https://github.com/394-s25/community-talks/tree/main)
App Link: [https://evanstoncommunitytalks.web.app/home](https://evanstoncommunitytalks.web.app/home)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[Javascript.js]: https://img.shields.io/badge/logo-javascript-blue?logo=javascript
[FontAwesome-url]: https://fontawesome.com/

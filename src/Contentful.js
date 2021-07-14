import './App.css';
import config from './config';
import { useState, useEffect } from "react";
import { exchangeToken, authorizeStrava, getAthleteInfo } from './api/strava';
import { getAthletes } from './api/contentful';

export default function App() {
  const { strava, contentful } = config;

  const syncStravaToContentful = async (code) => {
    const stravaToken = await exchangeToken(code);
    const athlete = await getAthleteInfo(stravaToken);
    console.log("athlete", athlete);
    const athletes = await getAthletes();
    console.log("athletes", athletes);
    const isNewAthlete = !athletes.find( existingAthlete => {
      console.log("existing", existingAthlete);
      console.log("new", athlete.firstName, athlete.lastName);
      return existingAthlete.firstName === athlete.firstname && existingAthlete.lastName === athlete.lastname
    }
    );
    console.log("is new athlete", isNewAthlete);
    //check if athlete exists in contentful
    //if not, insert athlete
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if(code) syncStravaToContentful(code);

  }, []);

  // if (!athletes) {
  //   return "Loading...";
  // }
  return  (
    <a
            className="App-link"
            rel="noopener noreferrer"
            onClick={authorizeStrava}
          >
            Authorize Strava
          </a>
  );

  // // render the fetched Contentful data
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={page.logo.url} className="App-logo" alt="logo" />
  //       <p>{page.title}</p>
  //     </header>
  //   </div>
  // );
}
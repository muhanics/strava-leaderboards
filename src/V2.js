import './App.css';
import { useState, useEffect } from "react";
import { exchangeToken, authorizeStrava, getAthleteInfo, getAthleteActivities } from './api/strava';
import { getAthletes, createEntry } from './api/contentful';

export default function App() {
  const syncStravaToContentful = async (code) => {
    const stravaToken = await exchangeToken(code);
    const athlete = await getAthleteInfo(stravaToken); //don't need this req as the info is received after auth
    const athletes = await getAthletes();

    const isNewAthlete = !athletes.find( existingAthlete =>
      existingAthlete.firstName === athlete.firstname
        && existingAthlete.lastName === athlete.lastname
    );
    if(isNewAthlete) createEntry('athlete',{
      athleteId: athlete.id,
      firstName: athlete.firstname,
      lastName: athlete.lastname
    });

    getAthleteActivities(stravaToken);
    //check if these activities exist in contentful
    //insert any new ones
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
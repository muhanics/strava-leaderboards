import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import config from './config';

function App() {

  const [ activities, setActivities ] = useState(null);

  const { api_url, client_id, client_secret, club_id } = config.strava;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  const getClubActivities = async (authToken) => {
    const response = await axios.get(`${api_url}/clubs/${club_id}/activities?per_page=200`, {headers: {Authorization: 'Bearer ' + authToken}})
    if(response.status === 200) setActivities(response.data);
    console.log("res data", response.data);
  }

  const exchangeToken = async () => {
    const response = await axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`)
    if(response.status === 200) getClubActivities(response.data.access_token);
  }

  if(code) exchangeToken();

  useEffect(()=>{ console.log("activitiesdasddsa", activities) }, [activities]);

  const authorize = () => {
    const url = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${config.app_url}&approval_prompt=auto&scope=read`;
    return window.location.href = url;
  }

  const renderActivities = () => {
    const athletes = {};
    activities.forEach( activity => {
      athletes[activity.athlete.firstname] = athletes[activity.athlete.firstname] || 0;
      athletes[activity.athlete.firstname] += Math.round(activity.moving_time / 60);
    })
    const sortedAthletes = Object.entries(athletes).sort(([,a],[,b]) => b-a);
    return sortedAthletes.map( ([athlete, minutes], i) => {
      console.log("athlete", athlete)
      const time = Math.floor(minutes / 60) + ' hours ' + minutes % 60;
      return <><div className="athlete">#{i+1} {athlete}</div><div className="time"> {time} mins</div></>
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        {activities ? <>
        <h3>🏆 Fixter Champions 🏆</h3>{renderActivities()}</> :
          <a
            className="App-link"
            rel="noopener noreferrer"
            onClick={authorize}
          >
            Authorize Strava
          </a>
        }
      </header>
    </div>
  );
}

export default App;

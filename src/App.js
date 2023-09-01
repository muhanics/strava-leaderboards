import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import config from './config';

function App() {

  const [ activities, setActivities ] = useState([]);

  const { api_url, client_id, client_secret, club_id } = config.strava;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  const getClubActivities = async (authToken) => {
    const response = await axios.get(`${api_url}/clubs/${club_id}/activities?per_page=200`, {headers: {Authorization: 'Bearer ' + authToken}})
    if(response.data.length) {
      console.log("Setting activities in state", response.data);
      setActivities(response.data);
    }
  }

  const exchangeToken = async () => {
    const response = await axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`)
    if(response.status === 200) getClubActivities(response.data.access_token);
  }

  if(code) exchangeToken();

  useEffect(() => {
    console.log('activities', activities);
  }, [activities])

  const authorize = () => {
    const url = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${config.app_url}&approval_prompt=auto&scope=read`;
    return window.location.href = url;
  }

  return (
    <div className="App">
      <header className="App-header">
        {activities.length ? <>
        <h3>have activities</h3></> :<>
            <a className="App-link" onClick={authorize}>
              Authorize Strava
            </a>
          </>
        }
      </header>
    </div>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Leaderboard from './Leaderboard';
import V2 from './V2';
import reportWebVitals from './reportWebVitals';

const shouldFetchData = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fetchDataParam = urlParams.get("fetchData");
  const stravaCodeParam = urlParams.get("code");
  const shouldFetchData = fetchDataParam || stravaCodeParam;

  return shouldFetchData;
}

const Menu = () => (
  <div className="menu">
    <a className="menu-item" href="/">Leaderboard</a>
    <a className="menu-item" href="/?fetchData=true">Strava Sync</a>
  </div>
)

ReactDOM.render(
  <React.StrictMode>
    {/* <V2 /> */}
    {/* above was WIP not complete - contentful one */}

    <Menu/>
    {shouldFetchData() ? <App /> : <Leaderboard/>}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Leaderboard from './Leaderboard';
import V2 from './V2';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    {/* <V2 /> */}
    {/* above was WIP not complete - contentful one */}


    <App />
    {/* <Leaderboard/> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

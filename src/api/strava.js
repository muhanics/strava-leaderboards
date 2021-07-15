import axios from 'axios';
import config from '../config';
import moment from 'moment';

const { strava } = config;

export const authorizeStrava = () => {
    const url = `${strava.oauth_base_url}/authorize?client_id=${strava.client_id}&response_type=code&redirect_uri=${config.app_url}&approval_prompt=auto&scope=read,activity:read`;
    return window.location.href = url;
}

export const getAthleteInfo = async (authToken) => {
    const res = await axios.get(`${strava.api_url}/athlete`, {headers: {Authorization: 'Bearer ' + authToken}})
    if(res.status === 200) return res.data;
}

export const getAthleteActivities = async (authToken) => {
    const before = moment().endOf('isoweek').format('X');
    const after = moment().startOf('isoweek').subtract(1, 'week').format('X');
    //TODO: remove the 1 week subtraction after testing is done

    const res = await axios.get(
        `${strava.api_url}/athlete/activities?before=${before}&after=${after}`,
        {headers: {Authorization: 'Bearer ' + authToken}}
    )
    if(res.status === 200) console.log("res st", res.data);//setActivities(response.data);
}

export const exchangeToken = async (code) => {
    const existingToken = localStorage.getItem("strava_token");
    if(existingToken) return existingToken;

    const response = await axios.post(`${strava.oauth_base_url}/token?client_id=${strava.client_id}&client_secret=${strava.client_secret}&code=${code}&grant_type=authorization_code`)
    if(response.status === 200) {
        localStorage.setItem("strava_token", response.data.access_token);
        return response.data.access_token;
    }
}

/*
STRAVA PERMISSION SCOPES (comma seperated in scope param of first auth req)
read: read public segments, public routes, public profile data, public posts, public events, club feeds, and leaderboards

read_all:read private routes, private segments, and private events for the user

profile:read_all: read all profile information even if the user has set their profile visibility to Followers or Only You

profile:write: update the user's weight and Functional Threshold Power (FTP), and access to star or unstar segments on their behalf

activity:read: read the user's activity data for activities that are visible to Everyone and Followers, excluding privacy zone data

activity:read_all: the same access as activity:read, plus privacy zone data and access to read the user's activities with visibility set to Only You

activity:write: access to create manual activities and uploads, and access to edit any activities that are visible to the app, based on activity read access level
*/

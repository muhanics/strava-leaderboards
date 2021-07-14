import axios from 'axios';
import config from '../config';

const { strava } = config;

export const authorizeStrava = () => {
    const url = `https://www.strava.com/oauth/authorize?client_id=${strava.client_id}&response_type=code&redirect_uri=${config.app_url}&approval_prompt=auto&scope=read`;
    return window.location.href = url;
}

export const getAthleteInfo = async (authToken) => {
    const res = await axios.get(`${strava.api_url}athlete`, {headers: {Authorization: 'Bearer ' + authToken}})
    if(res.status === 200) return res.data;
}

export const getAthleteActivities = async (authToken) => {
    const res = await axios.get(`${strava.api_url}athlete/activities`, {headers: {Authorization: 'Bearer ' + authToken}})
    if(res.status === 200) console.log("res st", res.data);//setActivities(response.data);
}

export const exchangeToken = async (code) => {
    const response = await axios.post(`https://www.strava.com/oauth/token?client_id=${strava.client_id}&client_secret=${strava.client_secret}&code=${code}&grant_type=authorization_code`)
    if(response.status === 200) return response.data.access_token;
}
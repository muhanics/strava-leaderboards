import config from '../config';
import axios from 'axios';
const { base_url, access_token } = config.contentful;

const requestHeaders = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
    }
};

export const getAthletes = async () => {
    const query = `
        {
            athleteCollection {
                items {
                firstName
                lastName
                }
            }
        }
    `;
    const { data } = await axios.post(
        base_url,
        JSON.stringify({ query }),
        requestHeaders
    );
    return data.data.athleteCollection.items;
}

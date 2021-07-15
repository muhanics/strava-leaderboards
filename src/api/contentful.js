import config from '../config';
import axios from 'axios';
const { api_base_url, gql_base_url, cm_access_token, cd_access_token } = config.contentful;

const commonCmHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${cm_access_token}`
};

const publishEntry = async (entryId) => {
    const { status } = await axios.put(
        `${api_base_url}/entries/${entryId}/published`,
        null,
        {
            headers: {
                ...commonCmHeaders,
                "X-Contentful-Version": 1
            }
        }
    );
    if(status === 200) console.log("Athlete created");
}

export const createEntry = async (type, entryData) => {
    const formattedData = (data) => {
        const fields = {};
        Object.entries(data).forEach( ([key, value]) => {
            fields[key] = {
                "en-US": value
            };
        });
        return { "fields": fields };
    };

    const { data } = await axios.post(
        `${api_base_url}/entries`,
        formattedData(entryData),
        {
            headers: {
                ...commonCmHeaders,
                "X-Contentful-Content-Type": type
            }
        }
    );
    const entryId = data.sys.id;
    publishEntry(entryId);
}

//TODO: without GQL for consistency
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
        gql_base_url,
        JSON.stringify({ query }),
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cd_access_token}`,
            }
        }
    );
    return data.data.athleteCollection.items;
}

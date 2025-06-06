import axios from 'axios';
import { getConfig } from './config';

const ELASTIC_BASE_URL = 'https://es.ruijs.fr'; // Replace with your ES URL
//const ELASTIC_BASE_URL = getConfig().ELASTIC_BASE_URL || 'https://es.ruijs.fr';

export const getClusterHealth = async () => {
    const response = await axios.get(`${ELASTIC_BASE_URL}/_cluster/health`);
    return response.data;
};

export const getNodes = async () => {
    const response = await axios.get(`${ELASTIC_BASE_URL}/_cat/nodes?format=json`);
    return response.data;
};

export const getIndices = async () => {
    const response = await axios.get(`${ELASTIC_BASE_URL}/_cat/indices?format=json`);
    return response.data;
};

export const getShards = async () => {
    const response = await axios.get(`${ELASTIC_BASE_URL}/_cat/shards?format=json`);
    return response.data;
};

export const getTasks = async () => {
    const response = await axios.get(`${ELASTIC_BASE_URL}/_tasks`)
    return response.data;
}

export const reRoute = async (
    index: string,
    shard: number,
    from_node: string,
    to_node: string
) => {
    const payload = {
        commands: [
            {
                move: {
                    index,
                    shard,
                    from_node,
                    to_node
                }
            }
        ]
    };
    try {
        const response = await axios.post(`${ELASTIC_BASE_URL}/_cluster/reroute`, payload);
        return response.data;
    } catch (error: any) {
        console.error('Shard relocation failed:', error?.response?.data || error.message);
        throw error;
    }
};
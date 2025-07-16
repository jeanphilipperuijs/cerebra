import axios from 'axios';
import { getConfig } from './config';

const getBaseUrl = () => getConfig().ELASTIC_BASE_URL || 'https://es.ruijs.fr';

export const getClusterHealth = async () => {
  const response = await axios.get(`${getBaseUrl()}/_cluster/health`);
  return response.data;
};

export const getNodes = async () => {
  const response = await axios.get(`${getBaseUrl()}/_cat/nodes?format=json&bytes=b`);
  return response.data;
};

export const getIndices = async () => {
  const response = await axios.get(`${getBaseUrl()}/_cat/indices?format=json&bytes=b`);
  return response.data;
};

export const getShards = async () => {
  const response = await axios.get(`${getBaseUrl()}/_cat/shards?format=json&bytes=b`);
  return response.data;
};

export const getTasks = async () => {
  const response = await axios.get(`${getBaseUrl()}/_tasks`);
  return response.data;
};

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
          to_node,
        },
      },
    ],
  };

  try {
    const response = await axios.post(`${getBaseUrl()}/_cluster/reroute`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Shard relocation failed:', error?.response?.data || error.message);
    throw error;
  }
};

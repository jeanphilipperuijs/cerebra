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
export const getIndicesReadStats = async () => {
  const res = await axios.get(
    `${getBaseUrl()}/_stats/search?filter_path=indices.*.total.search.query_total`
  );
  return res.data.indices || {};
};

export async function getIndicesWithLastWrite() {
  //const baseUrl = localStorage.getItem('ELASTIC_BASE_URL') || '';
  
  const statsRes = await fetch(`${getBaseUrl()}/_stats/indexing?human`);
  const statsJson = await statsRes.json();

  const indices: Array<{ index: string; lastWrite: string | null }> = [];

  for (const indexName in statsJson.indices) {
    const idx = statsJson.indices[indexName];

    // Some indices don't have indexing data (read-only or system)
    const time = idx?.total?.indexing?.index_time_in_millis;

    if (!time || time === 0) {
      indices.push({ index: indexName, lastWrite: null });
      continue;
    }

    // Convert Elasticsearch monotonic time to approximate timestamp
    const lastWriteTimestamp = Date.now() - time;

    indices.push({
      index: indexName,
      lastWrite: new Date(lastWriteTimestamp).toISOString()
    });
  }

  // Sort newest write first
  indices.sort((a, b) => (b.lastWrite ?? "").localeCompare(a.lastWrite ?? ""));

  return indices;
}

export const getIndicesWithLastWrite2 = async () => {
  const indices = await getIndices(); // existing call
  const readStats = await getIndicesReadStats();


  type CatIndex = {
    index: string;
    [key: string]: any; // allow all other ES fields
  };
  // Fetch stats in one optimized call for all indices
  const statsResponse = await axios.get(`${getBaseUrl()}/_stats/store?filter_path=indices.*.total.store.last_write_millis`);
  const stats = statsResponse.data.indices || {};

  return indices.map((idx: CatIndex) => {
    const reads = readStats[idx.index]?.total?.search?.query_total ?? 0;
    return {
      ...idx,
      reads,
    };
  });
};

export const getIndicesWithLastWrite1 = async () => {
  const base = getBaseUrl();

  // 1) Get all indices
  const { data: indices } = await axios.get(
    `${base}/_cat/indices?format=json&h=index`
  );

  // 2) For each index, get last timestamp
  const results = await Promise.all(
    indices.map(async ({ index }: { index: string }) => {
      try {
        const { data } = await axios.post(`${base}/${index}/_search`, {
          size: 1,
          sort: [{ "@timestamp": "desc" }],
          _source: ["@timestamp"]
        });

        const timestamp = data.hits?.hits?.[0]?._source?.["@timestamp"] ?? null;

        return { index, lastWrite: timestamp };
      } catch {
        return { index, lastWrite: null };
      }
    })
  );

  return results;
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

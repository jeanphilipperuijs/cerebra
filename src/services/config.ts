// config.ts
let config: { ELASTIC_BASE_URL?: string } = {};

export const loadConfig = async () => {
  try {
    const res = await fetch('/config/config.json');
    config = await res.json();
  } catch {
    console.warn('Failed to load config, using fallback');
    config = { ELASTIC_BASE_URL: 'http://es.elasticsearch:9200' }; // fallback
  }
};

export const getConfig = () => config;

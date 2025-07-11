let config: { ELASTIC_BASE_URL?: string } = {};

export const loadConfig = async () => {
  try {
    const res = await fetch('/config/config.json');
    config = await res.json();
  } catch {
    console.warn('Failed to load config.json, falling back');
    config = { ELASTIC_BASE_URL: 'http://localhost:9200' };
  }

  // Override from localStorage if available
  const storedUrl = localStorage.getItem('ELASTIC_BASE_URL');
  if (storedUrl) {
    config.ELASTIC_BASE_URL = storedUrl;
  }
};

export const getConfig = () => config;

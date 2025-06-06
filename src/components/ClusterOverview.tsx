import { useEffect, useState } from 'react';
import { getClusterHealth } from '../services/elasticsearch';
import EarWig from '../loader/earwig';

const ClusterOverview = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const data = await getClusterHealth();
      setHealth(data);
    } catch (err) {
      console.error("Failed to load cluster health", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  if (loading && !health) return <EarWig />;

  const statusColor = health?.status === 'green'
    ? 'green'
    : health?.status === 'yellow'
      ? 'yellow'
      : 'red';

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
      <details open={open} onToggle={() => setOpen(e.currentTarget.open)}>
        <summary className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cluster Overview</h2>
          <button
            onClick={loadHealth}
            disabled={loading}
            className="ml-4 px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Reloading...' : 'Reload'}
          </button>
        </summary>

        <ul className="mt-4 space-y-1 text-gray-700 dark:text-gray-300">
          <li><strong>Name:</strong> {health?.cluster_name}</li>
          <li>
            <strong>Status:</strong>{' '}
            <span className={`text-${statusColor}-500`}>
              {health?.status === 'green' ? '💚' :
                health?.status === 'yellow' ? '🟡' :
                  health?.status === 'red' ? '🚩' : health?.status}
            </span>
          </li>
          <li><strong>Nodes:</strong> {health?.number_of_nodes}</li>
          <li><strong>Data Nodes:</strong> {health?.number_of_data_nodes}</li>
          <li><strong>Active Shards:</strong> {health?.active_shards}</li>
        </ul>
      </details>
    </div>
  );
};

export default ClusterOverview;

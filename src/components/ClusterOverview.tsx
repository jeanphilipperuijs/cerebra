import { useEffect, useState } from 'react';
import { getClusterHealth } from '../services/elasticsearch';
import EarWig from '../loader/earwig';

const ClusterOverview = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getClusterHealth().then(data => {
      setHealth(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <EarWig />;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
      <details open={open} onToggle={() => setOpen(e.currentTarget.open)}>
        <summary> <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Cluster Overview</h2>
        </summary>
        <ul className="space-y-1 text-gray-700 dark:text-gray-300">
          <li><strong>Name:</strong> {health.cluster_name}</li>
          <li><strong>Status:</strong> <span className={`text-${health.status === 'green' ? 'green' : health.status === 'yellow' ? 'yellow' : 'red'}-500`}>
            {
              health.status === 'green' ? '💚' :
                health.status === 'yellow' ? '🟡' :
                  health.status === 'red' ? '🚩' : health.status
            }
          </span></li>
          <li><strong>Nodes:</strong> {health.number_of_nodes}</li>
          <li><strong>Data Nodes:</strong> {health.number_of_data_nodes}</li>
          <li><strong>Active Shards:</strong> {health.active_shards}</li>
        </ul>
      </details>
    </div>
  );
};

export default ClusterOverview
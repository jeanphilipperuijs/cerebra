import { useEffect, useState } from 'react';
import { getClusterHealth } from '../services/elasticsearch';
import EarWig from '../loader/earwig';
import ElasticsearchTable from './ElasticsearchTable';

const ClusterOverview = () => {
  const [health, setHealth] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const data = await getClusterHealth();
      setHealth(data);
    } catch (err) {
      console.error('Failed to load cluster health', err);
    } finally {
      setLoading(false);
      setOpen(true)
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  if (loading && !health) return <EarWig />;
  if (!health) return null;

  const headers = Object.keys(health);
  const rows = [health];

  const statusIcon = (status: string) => {
    switch (status) {
      case 'green': return '💚';
      case 'yellow': return '🟡';
      case 'red': return '🚩';
      default: return status;
    }
  };

  const statusColorClass = (status: string) => {
    switch (status) {
      case 'green': return 'text-green-500';
      case 'yellow': return 'text-yellow-500';
      case 'red': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <ElasticsearchTable
      title="Cluster Overview"
      headers={headers}
      rows={rows}
      loading={loading}
      onRefresh={loadHealth}
      refreshInterval={60000}
      defaultOpen={open}
      collapsible={true}
      cellRenderer={(value, key) =>
        key === 'status' ? (
          <span className={statusColorClass(value)}>
            {statusIcon(value)} {value}
          </span>
        ) : (
          String(value ?? '-')
        )
      }
    />
  );
};

export default ClusterOverview;

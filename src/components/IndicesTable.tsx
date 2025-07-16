import React, { useEffect, useState } from 'react';
import { getIndices } from '../services/elasticsearch';
import EarWig from '../loader/earwig';
import ElasticsearchTable from './ElasticsearchTable';

const IndicesTable = () => {
  const [indices, setIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);

  const loadIndices = async () => {
    setLoading(true);
    try {
      const data = await getIndices();
      setIndices(data);
    } catch (err) {
      console.error('Failed to load indices', err);
    } finally {
      setLoading(false);
      setOpen(true)
    }
    
  };

  useEffect(() => {
    loadIndices();
  }, []);

  if (loading) return <EarWig />;

  const headers = Object.keys(indices[0] || {});

  return (
    <ElasticsearchTable
      title="Indices"
      headers={headers}
      rows={indices}
      loading={loading}
      refreshInterval={60000}
      cellRenderer={(value) => (value === 'green' ? <>{value} 💚</> : String(value ?? '-'))}
      onRefresh={loadIndices}
      collapsible={true}
      defaultOpen={false}
    />
  );
};

export default IndicesTable;

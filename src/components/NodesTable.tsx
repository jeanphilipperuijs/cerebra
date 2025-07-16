import React, { useEffect, useState } from 'react';
import { getNodes } from '../services/elasticsearch';
import EarWig from '../loader/earwig';
import ElasticsearchTable from './ElasticsearchTable';

const NodesTable = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadNodes = async () => {
    setLoading(true);
    try {
      const data = await getNodes();
      setNodes(data);
    } catch (err) {
      console.error("Failed to load nodes", err);
    } finally {
      setLoading(false);
      setOpen(true)
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  if (loading && nodes.length === 0) return <EarWig />;

  const headers = Object.keys(nodes[0] || {});

  return (
    <ElasticsearchTable
      title="Cluster Nodes"
      headers={headers}
      rows={nodes}
      loading={loading}
      onRefresh={loadNodes}
      refreshInterval={60000}
      collapsible={true}
      defaultOpen={false}
    />

  );
};

export default NodesTable;

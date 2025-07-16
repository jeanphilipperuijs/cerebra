import React, { useEffect, useState } from 'react';
import { Button, Select, MenuItem } from '@mui/material';
import { getNodes, getShards, reRoute } from '../services/elasticsearch';
import ElasticsearchTable from './ElasticsearchTable';
import EarWig from '../loader/earwig';

const ShardViewer = () => {
  const [shards, setShards] = useState<any[]>([]);
  const [nodes, setNodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShard, setSelectedShard] = useState<any | null>(null);
  const [targetNode, setTargetNode] = useState('');
  const [relocating, setRelocating] = useState(false);
  const [open, setOpen] = useState(false);


  const loadData = async () => {
    setLoading(true);
    try {
      const [shardData, nodeData] = await Promise.all([getShards(), getNodes()]);
      setShards(shardData);
      setNodes(nodeData.map((n: any) => n.name));
    } catch (err) {
      console.error('Failed to load shard/node data', err);
    } finally {
      setLoading(false);
      setOpen(true)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRelocate = async () => {
    if (!selectedShard || !targetNode) return;

    setRelocating(true);
    try {
      await reRoute(selectedShard.index, Number(selectedShard.shard), selectedShard.node, targetNode);
      alert('Shard relocated!');
      setSelectedShard(null);
      setTargetNode('');
      await loadData(); // Refresh table after relocation
    } catch (err) {
      alert('Failed to relocate shard.');
    } finally {
      setRelocating(false);
    }
  };

  if (loading && shards.length === 0) return <EarWig />;

  // Prepare table headers and rows
  const baseHeaders = shards[0] ? Object.keys(shards[0]) : [];
  const headers = [...baseHeaders, 'action'];

  return (
    <div>
      <ElasticsearchTable
        title="Shards"
        headers={headers}
        rows={shards.map((shard) => ({
          ...shard,
          action: shard, // Pass full shard object for the action button
        }))}
        loading={loading}
        onRefresh={loadData}
        collapsible={true}
        defaultOpen={false}
        cellRenderer={(value, key) => {
          if (key === 'action' && typeof value === 'object') {
            return (
              <Button variant="text" onClick={() => setSelectedShard(value)}>
                Relocate
              </Button>
            );
          }
          return String(value ?? '-');
        }}
      />

      {selectedShard && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow">
          <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Relocate Shard {selectedShard.shard} from {selectedShard.node}
          </h3>
          <Select
            value={targetNode}
            onChange={(e) => setTargetNode(e.target.value)}
            displayEmpty
            variant="outlined"
            size="small"
            sx={{ minWidth: 200, marginRight: 2 }}
          >
            <MenuItem value="">Select destination node</MenuItem>
            {nodes
              .filter((n) => n !== selectedShard.node)
              .map((node) => (
                <MenuItem key={node} value={node}>
                  {node}
                </MenuItem>
              ))}
          </Select>
          <Button
            onClick={handleRelocate}
            disabled={!targetNode || relocating}
            variant="contained"
            color="primary"
          >
            {relocating ? 'Relocating...' : 'Confirm Move'}
          </Button>
          <Button
            onClick={() => setSelectedShard(null)}
            variant="text"
            sx={{ marginLeft: 1 }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShardViewer;

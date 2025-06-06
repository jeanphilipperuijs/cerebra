import React, { useEffect, useState } from 'react';
import { getNodes } from '../services/elasticsearch';
import EarWig from '../loader/earwig';

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
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  if (loading && nodes.length === 0) return <EarWig />;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
      <details open={open} onToggle={() => setOpen(e.currentTarget.open)}>
        <summary className="flex items-center justify-between cursor-pointer">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cluster Nodes</h2>
          <button
            onClick={loadNodes}
            disabled={loading}
            className="ml-4 px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Reloading...' : 'Reload'}
          </button>
        </summary>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm text-left border">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                {Object.keys(nodes[0] || {}).map((key) => (
                  <th key={key} className="p-2 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((node, index) => (
                <tr key={index} className="hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100">
                  {Object.values(node).map((value, i) => {
                    const icon = value === '*' ? '🐐 ' : '';
                    return <td key={i} className="p-2 border">{icon}{String(value)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

export default NodesTable;

import React, { useEffect, useState } from 'react';
import { getNodes } from '../services/elasticsearch';
import EarWig from '../loader/earwig';

const NodesTable = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getNodes().then(data => {
      setNodes(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <EarWig />;


  return (
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
      <details open={open} onToggle={() => setOpen(e.currentTarget.open)}>
        <summary>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Cluster Nodes</h2>
        </summary>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(nodes[0] || {}).map((key) => (
                  <th key={key} className="p-2 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((node, index) => (
                <tr key={index} className="hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {Object.values(node).map((value, i) => {
                    let icon = ''
                    switch (value) {
                      case '*':
                        icon = '🐐'
                    }
                    return <td key={i} className="p-2 border">{icon} {String(value)}</td>
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

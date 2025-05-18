import React, { useEffect, useState } from 'react';
import { getIndices } from '../services/elasticsearch';
import EarWig from '../loader/earwig';

const IndicesTable = () => {
  const [indices, setIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getIndices().then(data => {
      setIndices(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <EarWig />;


  return (
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
      <details open={open} onToggle={() => setOpen(e.currentTarget.open)}>
        <summary>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Indices</h2>
        </summary>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(indices[0] || {}).map((key) => (
                  <th key={key} className="p-2 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indices.map((idx, index) => (
                <tr key={index} className="hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {Object.values(idx).map((value, i) => {
                    let icon: string = '';
                    switch (value) {
                      case 'green':
                        icon = '💚'
                        break;
                      default:
                        icon = ''
                        break;
                    }
                    return <td key={i} className="p-2 border">{icon} {String(value)}</td>
                  }
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

export default IndicesTable;

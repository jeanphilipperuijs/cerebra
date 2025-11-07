import React, { useEffect, useState } from 'react';
import EarWig from '../loader/earwig';
import ElasticsearchTable from './ElasticsearchTable';
import { getIndicesWithLastWrite } from '../services/elasticsearch';

/** Shape of returned data */
interface IndexActivity {
  index: string;
  lastWrite: string | null; // ISO string or null
}

const formatRelativeTime = (iso: string | null): string => {
  if (!iso) return "No writes";

  const date = new Date(iso);
  const now = Date.now();
  const diff = now - date.getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const IndicesActivityTable = () => {
  const [indices, setIndices] = useState<IndexActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIndices = async () => {
    setLoading(true);
    try {
      const data = await getIndicesWithLastWrite();
      setIndices(data);
    } catch (err) {
      console.error('Failed to load indices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndices();
  }, []);

  if (loading) return <EarWig />;

  return (
    <ElasticsearchTable
      title="Indices (Last Write Activity)"
      headers={["index", "lastWrite"]}
      rows={indices}
      refreshInterval={30000}
      onRefresh={loadIndices}
      collapsible
      defaultOpen={false}
      cellRenderer={(value, key) => {
        if (key === "lastWrite") {
          if (!value) return "No writes";

          const iso = value as string;
          return (
            <span title={new Date(iso).toISOString()}>
              {new Date(iso).toLocaleString()}{" "}
              <span className="text-gray-500 dark:text-gray-400">
                ({formatRelativeTime(iso)})
              </span>
            </span>
          );
        }
        return value ?? "-";
      }}
    />
  );
};

export default IndicesActivityTable;

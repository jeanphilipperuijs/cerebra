import React, { useEffect, useState } from 'react';
import { getNodes, getShards, reRoute } from '../services/elasticsearch';
import EarWig from '../loader/earwig';

const ShardViewer = () => {
    const [open, setOpen] = useState(false);
    const [shards, setShards] = useState<any[]>([]);
    const [nodes, setNodes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShard, setSelectedShard] = useState<any | null>(null);
    const [targetNode, setTargetNode] = useState('');
    const [relocating, setRelocating] = useState(false);

    useEffect(() => {
        Promise.all([getShards(), getNodes()]).then(([shardData, nodeData]) => {
            setShards(shardData);
            setNodes(nodeData.map((n: any) => n.name));
            setLoading(false);
        });
    }, []);

    if (loading) return <EarWig />;

    const handleRelocate = async () => {
        console.log("Relocate clicked:", selectedShard, targetNode);
        if (!selectedShard || !targetNode) return;

        setRelocating(true);
        try {
            await reRoute(selectedShard.index, Number(selectedShard.shard), selectedShard.node, targetNode);
            alert('Shard relocated!');
            setSelectedShard(null);
            setTargetNode('');
        } catch (err) {
            alert('Failed to relocate shard.');
        } finally {
            setRelocating(false);
        }
    };

    if (loading) return <div>Loading shards...</div>;

    return (
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
            <details open={open} onToggle={() => setOpen(e.currentTarget.open)}>
                <summary>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Shard Viewer</h2>
                </summary>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                {Object.keys(shards[0] || {}).map((key) => (
                                    <th key={key} className="p-2 border text-left text-gray-700 dark:text-gray-300">{key}</th>
                                ))}
                                <th className="p-2 border text-left text-gray-700 dark:text-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shards.map((shard, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    {Object.values(shard).map((value, i) => (
                                        <td key={i} className="p-2 border">{String(value)}</td>
                                    ))}
                                    <td className="p-2 border">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => {
                                                console.log("Selected shard:", shard);
                                                setSelectedShard(shard);
                                            }}
                                        >
                                            Relocate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {selectedShard ? console.log("Selected shard state exists") : null}
                {/* Inline relocate panel */}
                {selectedShard && (
                    <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow">
                        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100">
                            Relocate Shard {selectedShard.shard} from {selectedShard.node}
                        </h3>
                        <select
                            className="p-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-600 text-gray-800 dark:text-gray-100"
                            value={targetNode}
                            onChange={(e) => {
                                console.log("Target node:", targetNode);;
                                setTargetNode(e.target.value)
                            }
                            }
                        >
                            <option value="">Select destination node</option>
                            {nodes
                                .filter((n) => n !== selectedShard.node)
                                .map((node) => (
                                    <option key={node} value={node}>
                                        {node}
                                    </option>
                                ))}
                        </select>
                        <button
                            onClick={handleRelocate}
                            disabled={!targetNode || relocating}
                            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {relocating ? 'Relocating...' : 'Confirm Move'}
                        </button>
                        <button
                            onClick={() => setSelectedShard(null)}
                            className="ml-2 text-sm text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </details>
        </div>
    );
};


export default ShardViewer;

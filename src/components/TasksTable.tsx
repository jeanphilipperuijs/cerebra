import React, { useEffect, useState, useMemo } from 'react';
import { getTasks } from '../services/elasticsearch';
import EarWig from '../loader/earwig';

interface Task {
    nodeName: string;
    nodeHost: string;
    nodeId: string;
    taskId: string;
    parentTaskId?: string;
    action?: string;
    type?: string;
    description?: string;
    running_time?: number;
    start_time?: number;
}

const formatNanos = (nanos?: number): string => {
    if (!nanos) return '-';
    const ms = nanos / 1_000_000;
    return `${ms.toFixed(0)} ms`;
};

const TasksTable: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(2000);// refresh every 2 seconds

    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await getTasks();
            const flatTasks: Task[] = [];

            Object.entries(data.nodes || {}).forEach(([nodeId, node]) => {
                const { name: nodeName, host: nodeHost, tasks = {} } = node;

                Object.entries(tasks).forEach(([taskId, task]) => {
                    flatTasks.push({
                        action: task.action,
                        nodeName,
                        nodeHost,
                        nodeId,
                        taskId,
                        parentTaskId: task.parent_task_id,
                        type: task.type,
                        description: task.description,
                        running_time: task.running_time_in_nanos,
                        start_time: task.start_time_in_millis,
                    });
                });
            });

            setTasks(flatTasks);
        } catch (err) {
            console.error('Failed to load tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks(); // initial load

        const interval = setInterval(() => {
            loadTasks();
        }, refresh); 

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    const tableHeaders = useMemo(() => [
        'Action',
        'Task ID', 'Parent Task ID', 'Type', 'Description', 'Running Time', 'Start Time',
        'Node Name', 'Node Host', 'Node ID',
    ], []);

    if (loading && tasks.length === 0) return <EarWig />;

    return (
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6">
            <details open={open} onToggle={() => setOpen(e.currentTarget.open)}>
                <summary className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tasks</h2>
                    <button
                        onClick={loadTasks}
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
                                {tableHeaders.map(header => (
                                    <th key={header} className="p-2 border whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, index) => (
                                <tr key={index} className="hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100">
                                    <td className="p-2 border">{task.action || '-'}</td>
                                    <td className="p-2 border">{task.taskId}</td>
                                    <td className="p-2 border">{task.parentTaskId || '-'}</td>
                                    <td className="p-2 border">{task.type || '-'}</td>
                                    <td className="p-2 border">{task.description || '-'}</td>
                                    <td className="p-2 border">{formatNanos(task.running_time)}</td>
                                    <td className="p-2 border">{task.start_time ? new Date(task.start_time).toLocaleString() : '-'}</td>
                                    <td className="p-2 border">{task.nodeName}</td>
                                    <td className="p-2 border">{task.nodeHost}</td>
                                    <td className="p-2 border">{task.nodeId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>
        </div>
    );
};

export default TasksTable;

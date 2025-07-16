import React, { useEffect, useState } from 'react';
import { getTasks } from '../services/elasticsearch';
import ElasticsearchTable from './ElasticsearchTable';
import type { Task, RawESTask } from '../types';

const formatNanos = (nanos?: number): string => {
  if (!nanos) return '-';
  const ms = nanos / 1_000_000;
  return `${ms.toFixed(0)} ms`;
};

const TasksTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();

      const flatTasks: Task[] = [];

      Object.entries(data.nodes || {}).forEach(([nodeId, rawNode]) => {
        const node = rawNode as {
          name: string;
          host: string;
          tasks: Record<string, RawESTask>;
        };

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
    loadTasks();
  }, []);

  return (
    <ElasticsearchTable
      title="Tasks"
      headers={[
        'action', 'taskId', 'parentTaskId', 'type', 'description',
        'running_time', 'start_time', 'nodeName', 'nodeHost', 'nodeId',
      ]}
      rows={tasks.map(task => ({
        ...task,
        running_time: formatNanos(task.running_time),
        start_time: task.start_time ? new Date(task.start_time).toLocaleString() : '-',
      }))}
      loading={loading}
      onRefresh={loadTasks}
      refreshInterval={60000}
      collapsible={true}          // optional, if you want the details toggle
      defaultOpen={false}         // optional, default collapsed
    />
  );
};

export default TasksTable;

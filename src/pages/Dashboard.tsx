import React from 'react';
import ClusterOverview from '../components/ClusterOverview';
import TasksTable from '../components/TasksTable';
import NodesTable from '../components/NodesTable';
import IndicesTable from '../components/IndicesTable';
import ShardViewer from '../components/ShardView';
import SettingsPanel from '../components/SettingsPanel';

const Dashboard = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Cerebra Dashboard</h1>
      
       <SettingsPanel />

      <ClusterOverview />
      <NodesTable />
      <TasksTable />
      <IndicesTable />
      <ShardViewer />
    </div>
  );
};
export default Dashboard;

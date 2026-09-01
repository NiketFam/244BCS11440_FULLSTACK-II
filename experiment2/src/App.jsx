import React from 'react';
import { StudentProvider } from './StudentContext';
import Header from './Header';
import ProfilePanel from './ProfilePanel';
import TaskManager from './TaskManager';

function App() {
  return (
    <StudentProvider>
      <div>
        <Header />
        <ProfilePanel />
        <TaskManager />
      </div>
    </StudentProvider>
  );
}

export default App;
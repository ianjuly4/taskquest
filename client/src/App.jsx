// App.jsx
import React from 'react';
import Account from './Account';
import TaskContainer from "./TaskContainer"
import Header from './Header';
import CreateTask from './CreateTask';
import PhaserGame from './PhaserGame';

function App() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col rounded-3xl p-6 overflow-hidden h-screen">

      <Header />
       <div className="mt-4">
        <CreateTask/>
      </div>
      <div className="mt-4">
        <TaskContainer />
      </div>
        <PhaserGame/>
    </div>

  );
}

export default App;

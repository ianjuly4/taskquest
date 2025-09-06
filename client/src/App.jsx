// App.jsx
import React from 'react';
import Account from './Account';
import TaskContainer from "./TaskContainer"
import Header from './Header';
import CreateCurrentDayTask from './CreateCurrentDayTask';
import PhaserGame from './PhaserGame';

function App() {
  return (
    <div className=" relative max-w-3xl mx-auto flex flex-col  rounded-3xl p-6 overflow-hidden h-screen">
      <Header />
       <div className="mt-4 relative z-20">
        <CreateCurrentDayTask/>
      </div>
      <div className="mt-4 relative z-10">
        <TaskContainer />
      </div>
        <PhaserGame testMode={true}/>
    </div>

  );
}

export default App;

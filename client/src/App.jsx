// App.jsx
import React from 'react';
import Account from './Account';
import TaskContainer from "./TaskContainer"
import Header from './Header';
import AddTask from './AddTask';

function App() {
  return (
    <div className="min-h-[600px] max-w-3xl  mx-auto border-4 border-gray-300 flex flex-col rounded-3xl p-6">
      <Header />
       <div className="mt-4">
        <AddTask/>
      </div>
      <div className="mt-4">
        <TaskContainer />
      </div>
    </div>

  );
}

export default App;

import React, { useState, useContext } from "react";
import TaskCard from "./TaskCard.jsx";
import { MyContext } from "./MyContext.jsx";

const TaskContainer = () => {
  const { dates, user, isLoggedIn } = useContext(MyContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedDate = currentDate.toLocaleDateString();
  const today = dates.find((d) => d.date === formattedDate);
  const tasks = today?.tasks || [];

  //console.log(today.tasks)
  return (
    <div className='border-4 border-gray-300 black-text flex flex-col rounded-3xl p-6'>
      <h2 className="text-xl font-bold">
        {formattedDate} Tasks:
      </h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))
      ) : (
        <p>No tasks for this date.</p>
      )}
    </div>
  );
};

export default TaskContainer;

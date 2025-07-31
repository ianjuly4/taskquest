import React, { useState, useContext } from "react";
import TaskCard from "./TaskCard.jsx";
import { MyContext } from "./MyContext.jsx";
import TimeSlots from "./TimeSlots.jsx";

const TaskContainer = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [completedTasks, setCompletedTasks] = useState([])
  const { user, loading } = useContext(MyContext)
  const dates = user?.dates;

  // Format header date
  const formattedDateHeader = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isToday = (dateStr) => {
    if(!dateStr || typeof dateStr !== 'string') return false;

    const date = new Date(dateStr.replace(" ", "T") + "Z");
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  const todayEntries = dates?.filter((d) => isToday(d.date_time)) || [];
  const allTodaysTasks = todayEntries.flatMap((entry) => entry.tasks || []);

  const hasTasksToday = allTodaysTasks.length > 0;
  const taskLength = allTodaysTasks.length;

  if (loading ){
    return(
      <div className="border-4 bg-gray-300 border-gray-300 black-text rounded-3xl p-6 h-[600px] flex flex-col items-center justify-center text-lg text-gray-600">
        Loading......
      </div>
    )
  }

  const handleCompleteTask = (task)=>{
    console.log(task)
    setCompletedTasks((prevTasks) => [...prevTasks, task]);
  }

  return (
  <>
    {hasTasksToday ? (
      <div className="border-4 bg-gray-300 border-gray-300 rounded-3xl p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{formattedDateHeader} Tasks:</h2>
          <h2 className="text-m font-bold text-gray-600">
            Completed: {completedTasks.length} / {taskLength}
          </h2>
        </div>
        <div className="flex-1 overflow-auto">
          <TimeSlots handleCompleteTask={handleCompleteTask} />
        </div>
      </div>
    ) : (
      <div className="border-4 bg-gray-300 border-gray-300 rounded-3xl p-6 flex flex-col items-center justify-center text-lg text-black h-full">
        <h2 className="text-xl font-bold mb-4">{formattedDateHeader} Tasks:</h2>
        Currently No Tasks Today
      </div>
    )}
  </>
  );
}
export default TaskContainer;

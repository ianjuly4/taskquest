import React, { useState, useContext } from "react";
import TaskCard from "./TaskCard.jsx";
import { MyContext } from "./MyContext.jsx";
import TimeSlots from "./TimeSlots.jsx";

const TaskContainer = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useContext(MyContext)
  const dates = user?.dates;
  //console.log(dates)

  // Format header date
  const formattedDateHeader = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isToday = (dateStr) => {
  const date = new Date(dateStr.replace(" ", "T") + "Z");
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
  };

const todayEntry = dates?.find((d) => isToday(d.date_time));
const hasTasksToday = todayEntry && todayEntry.tasks && todayEntry.tasks.length > 0;

  return (
    <div className="border-4 border-gray-300 black-text rounded-3xl p-6 h-[700px] flex flex-col">
      <h2 className="text-xl font-bold mb-4">{formattedDateHeader} Tasks:</h2>
      {hasTasksToday ? (
        <div className="flex-1 overflow-y-scroll">
          <TimeSlots />
        </div>) : (<div> Currently No Tasks Today</div>)}
    </div>


  )
}

export default TaskContainer;

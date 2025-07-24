import React, { useState, useContext } from "react";
import TaskCard from "./TaskCard.jsx";
import { MyContext } from "./MyContext.jsx";
import TimeSlots from "./TimeSlots.jsx";

const TaskContainer = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
 
  // Format header date
  const formattedDateHeader = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border-4 border-gray-300 black-text rounded-3xl p-6 h-[700px] flex flex-col">
      <h2 className="text-xl font-bold mb-4">{formattedDateHeader} Tasks:</h2>
        <div className="flex-1 overflow-y-scroll">
          <TimeSlots/>
        </div>
    </div>

  )
}

export default TaskContainer;

import React, { useState, useContext } from "react";
import TaskCard from "./TaskCard.jsx";
import { MyContext } from "./MyContext.jsx";

const TaskContainer = () => {
  const { user } = useContext(MyContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const dates = user?.dates || []; 
  console.log(dates)
  const dateTime = dates.map((d)=> d.date_time)
  console.log(dateTime)

  console.log(currentDate)
  // Format header date
  const formattedDateHeader = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const now = new Date();
  // Find today's date object that belongs to this user
  const today = dates.find((d) => {
    const date = new Date(d.date_time.replace(" ", "T")+ "Z");
    
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  });
  console.log("Today's matched date object:", today);
  console.log(today)
  const time = today?.date_time;
    if (time) {
      const taskDate = new Date(time.replace(" ", "T") + "Z");
      const taskTime = taskDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      console.log(taskTime);
    }
  const timeSlots = Array.from({ length: 24 * 2}, (_, i)=>{
    const hour = Math.floor(i/2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const time = new Date();
    time.setHours(hour)
    time.setMinutes(minutes)
    return time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
  });
  })

  return (
    <div className="border-4 border-gray-300 black-text rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-4">{formattedDateHeader} Tasks:</h2>

      
    </div>

  )
}

export default TaskContainer;

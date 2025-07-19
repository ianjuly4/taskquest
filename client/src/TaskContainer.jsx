import React, { useState, useContext } from "react";
import TaskCard from "./TaskCard.jsx";
import { MyContext } from "./MyContext.jsx";

const TaskContainer = () => {
  const { dates, user } = useContext(MyContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format header date
  const formattedDateHeader = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Find today's date object that belongs to this user
  const today = dates.find((d) => {
    const localDate = new Date(d.date_time);
    return (
      localDate.toDateString() === currentDate.toDateString() &&
      d.user_id === user?.id
    );
  });

  const tasks = today?.tasks?.filter((task) => task.user_id === user?.id) || [];

  // Format task with time
  const tasksWithTime = tasks.map((task) => {
    const dateObj = new Date(task.due_datetime);
    return {
      ...task,
      dueLocalTime: dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dueHour: dateObj.getHours(), // for aligning
    };
  });

  // Hour marks for the time column (adjust range as needed)
  const hourMarks = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  return (
    <div className="border-4 border-gray-300 black-text rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-4">{formattedDateHeader} Tasks:</h2>

      {!user ? (
        <p className="text-red-500">Please log in to view your tasks.</p>
      ) : (
        <div className="flex">
          {/* Left column: task cards in vertical space */}
          <div className="relative flex-1">
            {tasksWithTime.map((task) => {
              const topOffset = (task.dueHour - 8) * 60; // e.g. 9AM => 60px from top
              return (
                <div
                  key={task.id}
                  className="absolute left-0 right-0"
                  style={{ top: `${topOffset}px` }}
                >
                  <TaskCard task={task} />
                </div>
              );
            })}
          </div>

          {/* Right column: hour marks */}
          <div className="w-24 pl-4 border-l border-gray-400 text-sm text-gray-600">
            {hourMarks.map((hour) => {
              const label = new Date(0, 0, 0, hour).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={hour} className="h-[60px] flex items-start">
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskContainer;

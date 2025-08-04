import React, { useState, useEffect } from "react";

const TaskCard = ({ task, deleteTask, isOpen, onToggle, handleCompleteTask }) => {
  const {
    id,
    title,
    color,
    content,
    duration,
    status,
    startTime,
  } = task;

  const [timeLeft, setTimeLeft] = useState(null)
  const handleDelete = () => {
    deleteTask(task.id);
  };

  useEffect(() => {
  if (!startTime || !duration) return;

  const start = new Date(startTime); 
  const end = new Date(start.getTime() + duration * 60000);

  const interval = setInterval(() => {
    const now = new Date();

    const diff = end.getTime() - now.getTime(); 

    if (diff <= 0) {
      setTimeLeft("0m");
      clearInterval(interval);
    } else {
      const totalMinutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      const timeStr = [
        hours > 0 ? `${hours}h` : null,
        `${minutes}m`,
        `${seconds}s`,
      ]
        .filter(Boolean)
        .join(" ");

      setTimeLeft(timeStr);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [startTime, duration]);



  function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const parts = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);

  return parts.length ? parts.join(" ") : "0m";
  }

  function calculateEndTime(startTimeStr, durationMinutes) {
  if (!startTimeStr || !durationMinutes) return null;
  const start = new Date(startTimeStr);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  return end;
  }


  return (
    <div
      className="relative border-4 border-gray-300 black-text flex flex-col rounded-3xl p-4 shadow-md"
      style={{ backgroundColor: color }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">{title}</h1>
          {startTime && (
            <div className="text-sm text-gray-700 flex space-x-4">
              <p>
                <strong>Starts: </strong>{" "}
                {new Date(startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} 
              </p>
             
                <p>
                  <strong>Ends: </strong>
                  {calculateEndTime(startTime, duration).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
          
                  {status && (
                    <p>
                      <strong>Status: </strong>{status}
                    </p>
                  )}
            </div>
        )}
      </div>
        <button
          type="button"
          className="text-black text-2xl font-bold"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? "−" : "+"}
        </button>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-800 mb-4">
           
            <p>• Duration: {formatDuration(duration) || "N/A"} min</p>
            {content && <p>• Content: {content}</p>}
          </div>
          {content && (
            <p className="text-sm text-gray-900 mb-4">
              <span className="font-medium">Note:</span> {content}
            </p>
          )}

          {/* Complete/Delete Button */}
          <div className="flex justify-between items-center mt-4 w-full">
            {timeLeft && (
              <div className="flex flex-col space-y-2 text-sm text-gray-700 ml-auto">
                <p><strong>Time Remaining: </strong>{timeLeft}</p>
                <button className="bg-green-500 text-white px-3 py-1 rounded-md shadow text-sm" onClick={()=>handleCompleteTask(task.id)}>
                  Complete
                </button>
                <button className ="bg-red-400 text-white px-3 py-1 rounded-md shadow text-sm" onClick={()=>handleCompleteTask(task.id)}>
                  Delete
                </button>
              </div>
            )}
          
          </div>

         
        </>
      )}
    </div>
  );
};

export default TaskCard;

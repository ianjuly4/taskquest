import React, { useState, useEffect } from "react";

const TaskCard = ({ task, deleteTask, isOpen, onToggle, updateTask, handleCompleteTask, questStarted, setError }) => {
  const {
    id,
    title,
    color,
    content,
    duration,
    status,
    startTime,
  } = task;
<<<<<<< HEAD
  
 
  
=======

>>>>>>> 18e034cfffc65d23fdc3c40dfaab3d08e4aaf22f
  const [timeLeft, setTimeLeft] = useState(null)

  const handleDelete = () => {
    if(questStarted){
      setError("Cannot Delete Tasks While In Quest")
    }else{
      deleteTask(task.id);
    };
  }
  useEffect(() => {
  if (!startTime || !duration) return;

  const start = new Date(startTime); 
  const end = new Date(start.getTime() + duration * 60000);

<<<<<<< HEAD
    
=======
>>>>>>> 18e034cfffc65d23fdc3c40dfaab3d08e4aaf22f
  const interval = setInterval(() => {
    const now = new Date();
    const diff = end.getTime() - now.getTime(); 

    if (diff <= 0) {
      setTimeLeft("0m");
      clearInterval(interval);
      if(status !== "completed" && status !== "incomplete"){
        updateTask(task.id, {status: "incomplete"})
      }
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
      className="relative border-4 border-gray-300 black-text flex flex-col rounded-3xl p-4 shadow-md space-y-2 overflow-hidden"
      style={{ backgroundColor: color, height: "100%" }}
    >
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">{title}</h1>
        <button
          type="button"
          className="text-black text-2xl font-bold"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? "−" : "+"}
        </button>
      </div>

      {/* Metadata */}
      {startTime && (
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Starts:</strong> {new Date(startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          <p><strong>Ends:</strong> {calculateEndTime(startTime, duration).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      )}

      {/* Expanded Fields */}
      {isOpen && (
        <>
          {/* Editable Content Input */}
          <div className="mt-2">
            <label className="text-sm font-medium text-gray-700 block mb-1">Notes:</label>
            <input
              type="text"
              value={task.content || ""}
              onChange={(e) =>
                updateTask(task.id, { content: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Add task notes..."
            />
          </div>

          {/* Duration */}
          <p className="text-sm text-gray-800 mt-2">
            <strong>Duration:</strong> {formatDuration(duration) || "N/A"}
          </p>

          {/* Controls */}
          <div className="flex justify-end items-center space-x-3 mt-4">
            {status !== "completed" && status !=="incomplete" && timeLeft && (
              <>
                <p className="text-sm text-gray-700">
                  <strong>Time Left:</strong> {timeLeft}
                </p>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-md shadow text-sm"
                  onClick={() => handleCompleteTask(task.id, { status: "completed" })}
                >
                  Complete
                </button>
              </>
            )}
            <button
              className="bg-red-400 text-white px-3 py-1 rounded-md shadow text-sm"
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
  </div>
)
};

export default TaskCard;

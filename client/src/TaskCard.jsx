import React, { useState, useEffect } from "react";

const TaskCard = ({ task, deleteTask, isOpen, onToggle }) => {
  const {
    id,
    title,
    category,
    color,
    color_meaning,
    content,
    comments,
    duration_minutes,
    status,
    repeat,
    due_datetime,
    startTime,
  } = task;


  const [deleteDropDown, setDeleteDropDown] = useState(false);
  const [deleteAllRepeats, setDeleteAllRepeats] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(()=>{
    let targetTime;

    if(due_datetime){
      targetTime = new Date(due_datetime);
    } else if (startTime && duration_minutes){
      targetTime = new Date(new Date(startTime).getTime()+duration_minutes*60000);
    }
    if(!targetTime) return

    const updatedCountdown = ()=>{
      const now = new Date();
      const difference = targetTime - now
      if(difference <=0){
        setTimeLeft("00:00:00")
        return
      }
      const hours = String(Math.floor(difference/(1000*60*60))).padStart(2, "0");
      const minutes = String(Math.floor((difference/(1000*60))%60)).padStart(2, '0')
      const seconds = String(Math.floor((difference/1000)%60)).padStart(2,'0')

      setTimeLeft(`${hours}:${minutes}:${seconds}`)
    };
    updatedCountdown()
    const interval = setInterval(updatedCountdown, 1000)
    return ()=> clearInterval(interval)
  }, [due_datetime, duration_minutes, startTime])

  const handleDelete = () => {
    deleteTask(task.id, deleteAllRepeats);
    setDeleteDropDown(false);
  };

  let endTimeDisplay = null;
  if(due_datetime){
    endTimeDisplay = new Date(due_datetime).toLocaleDateString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }else if(startTime && duration_minutes){
    const endTime = new Date(new Date(startTime).getTime()+ duration_minutes*60000);
    endTimeDisplay= endTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
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
              {endTimeDisplay && (
                <p>
                  <strong>Ends: </strong>{endTimeDisplay}
                </p>
                )}
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
            {category&& <p>• Category: {category}</p>}
            {color_meaning && <p>• Color Meaning: {color_meaning}</p>}
            {due_datetime && <p>• Due: {due_datetime}</p>}
            <p>• Duration: {duration_minutes || "N/A"} min</p>
            {repeat && <p>• Repeats: {repeat}</p>}
            {comments && <p>• Comments: {comments}</p>}
            {content && <p>• Content: {content}</p>}
          </div>

          {content && (
            <p className="text-sm text-gray-900 mb-4">
              <span className="font-medium">Note:</span> {content}
            </p>
          )}

          {/* Delete Button */}
          <div className="flex justify-between items-center mt-4 w-full">
            {timeLeft && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <p><strong>Time Remaining: </strong>{timeLeft}</p>
                <button className="bg-green-500 text-white px-3 py-1 rounded-md shadow text-sm">
                  Complete
                </button>
              </div>
            )}
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm shadow"
              onClick={() => setDeleteDropDown(!deleteDropDown)}
            >
              Delete
            </button>
          </div>

          {/* Delete Dropdown */}
          {deleteDropDown && (
            <div
              className="absolute top-full right-0 mt-2 w-64  border border-gray-300 rounded-lg shadow-lg p-4 z-20"
              style={{backgroundColor:color}}
              onMouseLeave={() => setDeleteDropDown(false)}
            >
              <label className="flex items-center space-x-2 text-sm mb-2">
                <input
                  type="checkbox"
                  checked={deleteAllRepeats}
                  onChange={() => setDeleteAllRepeats(!deleteAllRepeats)}
                />
                <span>Delete all repeated tasks</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Tip: Uncheck to delete only this instance.
              </p>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm w-full"
              >
                Confirm Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskCard;

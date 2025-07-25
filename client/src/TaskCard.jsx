import React, { useState } from "react";

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
    dueLocalTime,
    startTime,
  } = task;

  const [deleteDropDown, setDeleteDropDown] = useState(false);
  const [deleteAllRepeats, setDeleteAllRepeats] = useState(false);

  const handleDelete = () => {
    // Pass deleteAllRepeats as an argument to deleteTask
    deleteTask(task.id, deleteAllRepeats);
    setDeleteDropDown(false);
  };

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
            <p className="text-sm text-gray-700">
              Starts:{" "}
              {new Date(startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
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
            <p>• Category: {category}</p>
            <p>• Color Meaning: {color_meaning}</p>
            {dueLocalTime && <p>• Due: {dueLocalTime}</p>}
            <p>• Duration: {duration_minutes || "N/A"} min</p>
            {repeat && <p>• Repeats: {repeat}</p>}
            {status && <p>• Status: {status}</p>}
            {comments && <p>• Comments: {comments}</p>}
          </div>

          {content && (
            <p className="text-sm text-gray-900 mb-4">
              <span className="font-medium">Note:</span> {content}
            </p>
          )}

          {/* Delete Button */}
          <div className="flex justify-end space-x-2 mt-auto">
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
              className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-20"
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

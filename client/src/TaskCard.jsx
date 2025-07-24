import React from "react";

const TaskCard = ({ task }) => {
  const {
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
  } = task;

  console.log(task)
  return (
    <div
      className="border-4 border-gray-300 black-text flex flex-col rounded-3xl p-4  shadow-md"
      style={{ backgroundColor: color }}
    >
      <h1 className="text-xl font-bold mb-1">{title}</h1>
      <p className="text-sm text-gray-800 mb-1">• Category: {category}</p>
      <p className="text-sm text-gray-800 mb-1">• Color Meaning: {color_meaning}</p>
      {dueLocalTime && (
        <p className="text-sm text-gray-800 mb-1">• Due: {dueLocalTime}</p>
      )}
      <p className="text-sm text-gray-800 mb-1">• Duration: {duration_minutes} min</p>
      {repeat && <p className="text-sm text-gray-800 mb-1">• Repeats: {repeat}</p>}
      {status && <p className="text-sm text-gray-800 mb-1">• Status: {status}</p>}
      {comments && <p className="text-sm text-gray-800 mb-1">• Comments: {comments}</p>}
      {content && <p className="text-sm text-gray-900 mt-2">{content}</p>}
    </div>
  );
};

export default TaskCard;

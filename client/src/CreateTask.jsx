import React, { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import { useFormik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTask = () => {
  const { user, isLoggedIn } = useContext(MyContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formSchema = yup.object().shape({
    date: yup
      .date()
      .required("Date is required")
      .min(today, "Date must be today or in the future"),
    title: yup.string().required("Title is required").max(100),
    category: yup.string().max(50, "Category too long"),
    duration: yup
      .string()
      .matches(/^(\d+\s*h)?\s*(\d+\s*m)?$/, "Use format like '1h 30m'"),
    dueDateTime: yup
      .date()
      .min(today, "Date must be today or in the future"),
  });

  const createTaskFormik = useFormik({
    initialValues: {
      date: "",
      title: "",
      category: "",
      duration: "",
      dueDateTime: "",
      status: "",
      color: "",
      colorMeaning: "",
      repeat: "",
      comments: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      const durationStr = values.duration || "";
      const hourMatch = durationStr.match(/(\d+)\s*h/);
      const minMatch = durationStr.match(/(\d+)\s*m/);

      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      const totalMinutes = hours * 60 + minutes;

      const formattedDate = values.date
        ? values.date.toISOString().split("T")[0]
        : null;
      const formattedDueDateTime = values.dueDateTime
        ? values.dueDateTime.toISOString()
        : null;

      const success = await createTask(
        formattedDate,
        values.title,
        values.category,
        totalMinutes,
        formattedDueDateTime,
        values.status,
        values.color,
        values.colorMeaning,
        values.repeat,
        values.comments
      );
    },
  });

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="w-full bg-gray-300 text-black border-4 border-gray-300 rounded-3xl p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Create Task</h1>
        <button
          type="button"
          className="text-black text-2xl font-bold"
          onClick={handleDropdownToggle}
        >
          {dropdownOpen ? "−" : "+"}
        </button>
      </div>

      {dropdownOpen &&
        (!isLoggedIn && !user ? (
          <div className="text-red-500 text-sm">
            Please Log in to use this feature
          </div>
        ) : (
          <form
            onSubmit={createTaskFormik.handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-4 mt-4"
          >
            {/* Date - full row */}
            <div className="flex flex-col col-span-1 sm:col-span-4">
              <label className="text-sm font-medium mb-1">Date</label>
              <DatePicker
                selected={createTaskFormik.values.date}
                onChange={(date) =>
                  createTaskFormik.setFieldValue("date", date)
                }
                placeholderText="current/future date"
                dateFormat="yyyy/MM/dd"
                className="border rounded px-2 py-1 text-sm w-[150px]"
              />
              {createTaskFormik.touched.date &&
                createTaskFormik.errors.date && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.date}
                  </div>
                )}
            </div>

            {/* Title */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                  Title
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "title" ? null : "title")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle title help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="title"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Go to Gym"
                value={createTaskFormik.values.title}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.title &&
                createTaskFormik.errors.title && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.title}
                  </div>
                )}

              {activeTooltip === "title" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  A brief description of the task.
                </div>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Category
                <button
                  type="button"
                  onClick={() => setShowHelper(!showHelper)}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle category help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="category"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Exercise"
                value={createTaskFormik.values.category}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.category &&
                createTaskFormik.errors.category && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.duration}
                  </div>
                )}

              {showHelper && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setShowHelper(false)}
                >
                 Optional. Label this task (e.g., ‘Exercise’, ‘Work’, ‘Health’).
                </div>
              )}
            </div>

            {/* Duration  */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Duration
                <button
                  type="button"
                  onClick={() => setShowHelper(!showHelper)}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle duration help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="duration"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. 1h 30m"
                value={createTaskFormik.values.duration}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.duration &&
                createTaskFormik.errors.duration && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.duration}
                  </div>
                )}

              {showHelper && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setShowHelper(false)}
                >
                 How much time you intend to spend on this task (e.g., ‘1h 30m’). Used for tracking and timeboxing.
                </div>
              )}
            </div>

            {/* Due Date and Time */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Due Date and Time
              </label>
              <DatePicker
                selected={createTaskFormik.values.dueDateTime}
                onChange={(date) =>
                  createTaskFormik.setFieldValue("dueDateTime", date)
                }
                placeholderText="Future date and time"
                dateFormat="yyyy/MM/dd h:mm aa"
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                className="border rounded px-2 py-1 text-sm w-[150px]"
              />
              {createTaskFormik.touched.dueDateTime &&
                createTaskFormik.errors.dueDateTime && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.dueDateTime}
                  </div>
                )}
            </div>

            {/* Status */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Status
                <button
                  type="button"
                  onClick={() => setShowHelper(!showHelper)}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle status help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="duration"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Pending"
                value={createTaskFormik.values.status}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.status &&
                createTaskFormik.errors.status && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.status}
                  </div>
                )}

              {showHelper && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setShowHelper(false)}
                >
                Current progress of this task (e.g., ‘pending’, ‘incomplete’, ‘complete’).
                </div>
              )}
            </div>

            {/* Color */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Color
                <button
                  type="button"
                  onClick={() => setShowHelper(!showHelper)}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle color help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="color"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Blue"
                value={createTaskFormik.values.color}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.color &&
                createTaskFormik.errors.color && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.color}
                  </div>
                )}

              {showHelper && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setShowHelper(false)}
                >
                Optional. Customize the task with a color. Use to visually organize tasks.
                </div>
              )}
            </div>

            {/* Color Meaning */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Color Meaning
                <button
                  type="button"
                  onClick={() => setShowHelper(!showHelper)}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle color meaning help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="color"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Difficulty or Priority"
                value={createTaskFormik.values.colorMeaning}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.colorMeaning &&
                createTaskFormik.errors.colorMeaning && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.colorMeaning}
                  </div>
                )}

              {showHelper && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setShowHelper(false)}
                >
                Optional. Describe what this color represents (e.g., ‘Urgent’, ‘Creative Work’).
                </div>
              )}
            </div>

            {/*Repeat*/}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Repeat
                <button
                  type="button"
                  onClick={() => setShowHelper(!showHelper)}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle repeat help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="color"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Repeat each day"
                value={createTaskFormik.values.repeat}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.repeat &&
                createTaskFormik.errors.repeat && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.repeat}
                  </div>
                )}

              {showHelper && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setShowHelper(false)}
                >
                Optional. Set how often this task repeats (e.g., ‘Daily’, ‘Weekly’, ‘Yearly’).
                </div>
              )}
            </div>
            {/*Comments*/}
             <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Comments
                <button
                  type="button"
                  onClick={() => setShowHelper(!showHelper)}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle comment help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="color"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Repeat each day"
                value={createTaskFormik.values.repeat}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.comments &&
                createTaskFormik.errors.comments && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.comments}
                  </div>
                )}

              {showHelper && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setShowHelper(false)}
                >
                Optional. Add any notes, details, or reminders about this task.
                </div>
              )}
            </div>
          </form>
        ))}
    </div>
  );
};

export default CreateTask;

import React, { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import { useFormik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTask = () => {
  const { user, isLoggedIn, createTask } = useContext(MyContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [colorDropDown, setColorDropDown] = useState(false)

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
    status: yup
      .string()
      .oneOf(["completed", "pending", "incomplete"], "Status must be 'completed', 'pending', or 'incomplete'")
      .required("Status is required"),
    color: yup
      .string()
      .oneOf(["Red", "Green", "Blue", "Yellow", "Purple", ""], "Select a valid color"),
    colorMeaning: yup
      .string()
      .max(50, 'Color meaning too long'),
    repeat: yup
      .string()
      .oneOf(["daily", "weekly", "monthly", ""], "Select if repeating"),
    comments: yup
      .string()
      .max(200, "Comments are too long")
  }).test(
    "duration-or-dueDateTime",
    "Either Duration or Due Date and Time is required",
    function (values) {
      const { duration, dueDateTime } = values;
      const hasDuration = !!duration?.trim();
      const hasDueDateTime = !!dueDateTime;
      return hasDuration || hasDueDateTime;
    }
  );

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

  const colorOptions = [
    { name: "None", value: ""},
    { name: "Red", value: "#EF4444" },
    { name: "Green", value: "#10B981" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Yellow", value: "#FACC15" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pastel Red", value: "#FF6961" },
    { name: "Pastel Orange", value: "#FFD580" },
    { name: "Pastel Teal", value: "#ACE7EF" },
    { name: "Pastel Blue", value: "#A0CED9" },
    { name: "Pastel Purple", value: "#CBAACB" },
    { name: "Pastel Pink", value: "#FFB7B2" },
    { name: "Pastel Mint", value: "#D0F0C0" },
    
   
  ];


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
            {/* Date */}
            <div className="flex flex-col col-span-1 sm:col-span-4 relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Date
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "date" ? null : "date")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle date help"
                >
                  ?
                </button>
              </label>
              <DatePicker
                selected={createTaskFormik.values.date}
                onChange={(date) => createTaskFormik.setFieldValue("date", date)}
                placeholderText="Current/future date"
                dateFormat="yyyy/MM/dd"
                className="border rounded px-2 py-1 text-sm w-[150px]"
              />
              {createTaskFormik.touched.date && createTaskFormik.errors.date && (
                <div className="text-red-500 text-sm">
                  {createTaskFormik.errors.date}
                </div>
              )}
              {activeTooltip === "date" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  Used to place the task on your calendar or task list. Must be today or a future date.
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
                placeholder="ex. Go to gym"
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
                  onClick={() => setActiveTooltip(activeTooltip === "category" ? null : "category")}
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

              {activeTooltip === "category" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
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
                  onClick={() => setActiveTooltip(activeTooltip === "duration" ? null : "duration")}
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

              {activeTooltip === "duration" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                 How much time you intend to spend on this task (e.g., ‘1h 30m’). Either duration or due date and time is required. Both are optional but at least one should be filled.
                </div>
              )}
            </div>

            {/* Due Date and Time */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Due Date and Time
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "due date and time" ? null : "due date and time")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle due date help"
                >
                  ?
                </button>
              </label>
              <DatePicker
                selected={createTaskFormik.values.dueDateTime}
                onChange={(date) => createTaskFormik.setFieldValue("dueDateTime", date)}
                placeholderText="Future date and time"
                dateFormat="yyyy/MM/dd h:mm aa"
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                className="border rounded px-2 py-1 text-sm w-[150px]"
              />
              {createTaskFormik.touched.dueDateTime && createTaskFormik.errors.dueDateTime && (
                <div className="text-red-500 text-sm">
                  {createTaskFormik.errors.dueDateTime}
                </div>
              )}
              {activeTooltip === "due date and time" && (
                <div
                  className="absolute left-full ml-2 top-0 bg-white border rounded p-2 w-60 text-xs shadow-md z-10"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  Set when the task should be finished. Helps with prioritization and time-sensitive planning. Either duration or due date and time is required. Both are optional but at least one should be filled.
                </div>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Status
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "status" ? null : "status")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle status help"
                >
                  ?
                </button>
              </label>
              <select
                type="text"
                name="status"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Pending"
                value={createTaskFormik.values.status}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="incomplete">incomplete</option>
              </select>
              {createTaskFormik.touched.status &&
                createTaskFormik.errors.status && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.status}
                  </div>
                )}

              {activeTooltip === "status" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
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
                  onClick={() =>
                    setActiveTooltip(activeTooltip === "color" ? null : "color")
                  }
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                >
                  ?
                </button>
              </label>

              <div className="relative">
                <button
                  type="button"
                  className="border border-gray-300 bg-white rounded px-2 py-1 text-sm w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setColorDropDown(colorDropDown === "color" ? null : "color")}
                >
                  <span className="flex items-center">
                    <span
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: createTaskFormik.values.color }}
                    />
                    {colorOptions.find((c) => c.value === createTaskFormik.values.color)?.name || "Select a color"}
                  </span>
                  <span>▾</span>
                </button>

                {colorDropDown === "color" && (
                  <div className="absolute z-10 bg-white border rounded shadow-md mt-1 w-full">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => {
                          createTaskFormik.setFieldValue("color", color.value);
                          setColorDropDown(null);
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {createTaskFormik.touched.color && createTaskFormik.errors.color && (
                <div className="text-red-500 text-sm">{createTaskFormik.errors.color}</div>
              )}

              {activeTooltip === "color" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
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
                  onClick={() => setActiveTooltip(activeTooltip === "color meaning" ? null : "color meaning")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle color meaning help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="color meaning"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Difficulty or priority"
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

              {activeTooltip === "color meaning" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
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
                  onClick={() => setActiveTooltip(activeTooltip === "repeat" ? null : "repeat")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle repeat help"
                >
                  ?
                </button>
              </label>
              <select
                name="repeat"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Daily"
                value={createTaskFormik.values.repeat}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              >
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monhtly">Monthly</option>
              </select>
              {createTaskFormik.touched.repeat &&
                createTaskFormik.errors.repeat && (
                  <div className="text-red-500 text-sm">
                    {createTaskFormik.errors.repeat}
                  </div>
                )}

              {activeTooltip === "repeat" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                Optional. Set how often this task repeats (e.g., ‘Daily’, ‘Weekly’, ‘Monthly’).
                </div>
              )}
            </div>

            {/*Comments*/}
             <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Comments
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "comments" ? null : "comments")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle comment help"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name="comments"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. Increase weight"
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

              {activeTooltip === "comments" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
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

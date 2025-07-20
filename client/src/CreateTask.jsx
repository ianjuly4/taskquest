import React, { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import { useFormik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTask = () => {
  const { user, isLoggedIn, createTask, tasks } = useContext(MyContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [colorDropDown, setColorDropDown] = useState(false)

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formSchema = yup.object().shape({
    dateTime: yup
      .date()
      .required("Date and time of task start is required")
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
      .oneOf([
        "", "#EF4444", "#10B981", "#3B82F6", "#FACC15", "#8B5CF6",
        "#FF6961", "#FFD580", "#ACE7EF", "#A0CED9", "#CBAACB", "#FFB7B2", "#D0F0C0"
      ], "Select a valid color"),
    colorMeaning: yup
      .string()
      .max(50, 'Color meaning too long'),
    repeat: yup
      .string()
      .oneOf(["daily", "weekly", "monthly", ""], "Select if repeating"),
    comments: yup
      .string()
      .max(200, "Comments are too long"),
    content: yup
      .string()
      .max(500, "Content is too log(max 500 characters)")

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
      dateTime: null,
      title: "",
      category: "",
      duration: "",
      dueDateTime: "",
      status: "",
      color: "",
      colorMeaning: "",
      repeat: "",
      comments: "",
      content: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      const durationStr = values.duration || "";
      const hourMatch = durationStr.match(/(\d+)\s*h/);
      const minMatch = durationStr.match(/(\d+)\s*m/);

      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      const totalMinutes = hours * 60 + minutes;

      const formattedDate = values.dateTime
        ? values.dateTime.toISOString()
        : null;
      const formattedDueDateTime = values.dueDateTime
        ? values.dueDateTime.toISOString()
        : null;
      console.log(formattedDate)
      console.log(formattedDueDateTime)
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
        values.comments,
        values.content
      );
      if(success){
        setDropdownOpen(false);
        createTaskFormik.resetForm()
      }
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

  const textInputFields = [
    {
      name: "category",
      label: "Category",
      placeholder: "ex. Exercise",
      tooltip: "Optional. Label this task (e.g., ‘Exercise’, ‘Work’, ‘Health’)",
    },
    {
      name: "duration",
      label: "Duration",
      placeholder: "ex. 1h 30m",
      tooltip:  "How much time you intend to spend on this task (e.g., ‘1h 30m’). Either duration or due date and time is required. Both are optional but at least one should be filled.",
    },
    {
      name: "colorMeaning",
      label: "ColorMeaning",
      placeholder: "ex. Difficulty or priority",
      tooltip: "Optional. Describe what this color represents (e.g., ‘Urgent’, ‘Creative Work’).",
    },
    {
      name: "comments",
      label: "Comments",
      placeholder: "ex. Increase weight",
      tooltip: "Optional. Add any notes, details, or reminders about this task.",
    }
  ]

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
      {/* Display Formik Errors if any */}
        {Object.keys(createTaskFormik.errors).length > 0 && createTaskFormik.submitCount > 0 && (
          <div className="mt-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded px-4 py-2">
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(createTaskFormik.errors).map(([key, error]) => (
                <li key={key}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
          <div className="col-span-1 sm:col-span-4 flex flex-col sm:flex-row gap-4">
            {/* DateTime */}
            <div className="flex flex-col col-span-1 sm:col-span-2 relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Date/Time
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "dateTime" ? null : "dateTime")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle dateTime help"
                >
                  ?
                </button>
              </label>
              <DatePicker
                selected={
                  createTaskFormik.values.dateTime
                    ? new Date(createTaskFormik.values.dateTime)
                    : null
                }
                onChange={(dateTime) => createTaskFormik.setFieldValue("dateTime", dateTime)}
                placeholderText="Task start"
                dateFormat="yyyy/MM/dd h:mm aa"
                showTimeSelect
                timeIntervals={15}
                timeCaption="Time"
                className="border rounded px-2 py-1 text-sm w-[150px]"
              />
            
              {activeTooltip === "date" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  Date and time of task start. Must be today or a future date.
                </div>
              )}
            </div>

            {/*Title */}
            <div className="flex flex-col col-span-1 sm:col-span-2 relative">
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
                className="border rounded px-2 py-1 text-sm w-[150px]"
                placeholder="ex. Go to gym"
                value={createTaskFormik.values.title}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />

              {activeTooltip === "title" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                A brief description of the task.
                </div>
              )}
            </div>
          </div>
            {textInputFields.map((field)=>(
            <div key={field.name} className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                 {field.label}
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === `${field.name}` ? null : `${field.name}`)}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label={`Toggle ${field.name} help`}
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                name={field.name}
                className="border rounded px-2 py-1 text-sm"
                placeholder={field.placeholder}
                value={createTaskFormik.values[field.name]}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {activeTooltip === `${field.name}` && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {field.tooltip}
                </div>
              )}
            </div>

            ))}
          
            {/* Due Date and Time */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 flex items-center">
                Due Date and Time
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "due date and time" ? null : "due date and time")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle due date and time help"
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
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="incomplete">incomplete</option>
              </select>
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
              {activeTooltip === "color" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  Optional. Customize the task with a color. Use to visually organize tasks.
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
                <option value="monthly">Monthly</option>
              </select>
              {activeTooltip === "repeat" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                Optional. Set how often this task repeats (e.g., ‘Daily’, ‘Weekly’, ‘Monthly’).
                </div>
              )}
            </div>

            {/*Content*/}
            <div className="flex flex-col relative sm:col-span-4">
              <label className="text-sm font-medium mb-1 flex items-center">
                Content
                <button
                  type="button"
                  onClick={() => setActiveTooltip(activeTooltip === "content" ? null : "content")}
                  className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  aria-label="Toggle content help"
                >
                  ?
                </button>
              </label>
              <textarea
                type="text"
                name="content"
                className="border rounded px-2 py-1 text-sm min-h-[100px] resize-y w-full"
                placeholder="e.g. 2 sets of bench press, 10 push-ups, and stretch"
                maxLength={500}
                value={createTaskFormik.values.content}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {(createTaskFormik.values.content || "").length}/500

              </div>
              {activeTooltip === "content" && (
                <div
                  className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md"
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  Optional. Detailed steps, notes, or specifics for completing the task."
                </div>
              )}
            </div>
            <div className="col-span-1 sm:col-span-4 flex justify-center mt-6">
            <button
              type="submit"
              className="text-sm bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              // disabled={createTaskFormik.isSubmitting || !createTaskFormik.isValid} // Remove this line
            >
              {/* You can keep or remove the conditional text */}
              Create Task
            </button>

          </div>

          </form>
        ))}
    </div>
  );
};

export default CreateTask;

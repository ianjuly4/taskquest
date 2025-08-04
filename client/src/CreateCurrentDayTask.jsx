import React, { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import { useFormik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateCurrentDayTask = () => {
  const { user, isLoggedIn, createTask, dateTime: now } = useContext(MyContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [colorDropDown, setColorDropDown] = useState(false);

  const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minSelectableTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
  const maxSelectableTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 45);


  const isToday = (someDate) => {
    return (
      someDate.getDate() === now.getDate() &&
      someDate.getMonth() === now.getMonth() &&
      someDate.getFullYear() === now.getFullYear()
    );
  };

  
  
  const formSchema = yup.object().shape({
    dateTime: yup
      .date()
      .required("Start date is required")
      .min(now, "Start date must be today and atleast 1 hour ahead"),
    title: yup.string().required("Title is required").max(100),
    duration: yup
      .string()
      .matches(/^(\d+\s*h)?\s*(\d+\s*m)?$/, "Format: '1h 30m'"),
    status: yup
      .string()
      .oneOf(["completed", "pending", "incomplete"])
      .required("Status is required"),
    color: yup
      .string()
      .oneOf([
        "",
        "#FF6961", "#FFD580", "#ACE7EF", "#A0CED9",
        "#CBAACB", "#FFB7B2", "#D0F0C0"
      ]),
    content: yup.string().max(500),
  });

  const createTaskFormik = useFormik({
    initialValues: {
      dateTime: null,
      title: "",
      duration: "",
      status: "",
      color: "",
      content: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      console.log(values.dateTime)
      console.log(values)
      const durationStr = values.duration || "";
      const hourMatch = durationStr.match(/(\d+)\s*h/);
      const minMatch = durationStr.match(/(\d+)\s*m/);
      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      const minutes = minMatch ? parseInt(minMatch[1]) : 0;
      const totalMinutes = hours * 60 + minutes;

      const formattedDate = values.dateTime ? values.dateTime.toISOString() : null;

      const success = await createTask(
        formattedDate,
        values.title,
        totalMinutes,
        values.status,
        values.color,
        values.content
      );

      if (success) {
        setDropdownOpen(false);
        createTaskFormik.resetForm();
      }
    },
  });

  function roundUpToNext15(date = now){
    const ms = 1000 * 60 *15 
    return new Date(Math.ceil(date.getTime()/ms)* ms)
  }

  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

  const colorOptions = [
    { name: "None", value: "" },
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
        <h1 className="text-xl font-bold">Create Current Day Task</h1>
        <button
          type="button"
          className="text-black text-2xl font-bold"
          onClick={handleDropdownToggle}
        >
          {dropdownOpen ? "−" : "+"}
        </button>
      </div>

      {/* Error block */}
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
        (!isLoggedIn || !user ? (
          <div className="text-red-500 text-sm mt-4">Please log in to use this feature.</div>
        ) : (
        <div className="absolute left-0 top-full w-full bg-gray-300 p-4 mt-2 z-30 rounded-3xl shadow-lg">
          <form onSubmit={createTaskFormik.handleSubmit} className="mt-4 space-y-6">
            {/* 1 Row of Fields */}
            <div className="grid grid-cols-1 gap-4">
              {/* Date/Time */}
              <div className="flex flex-col w-full max-w-xs mx-auto">
                <label className="text-sm font-medium mb-1 ">Date/Time</label>
                <DatePicker
                  selected={
                    createTaskFormik.values.dateTime
                      ? new Date(createTaskFormik.values.dateTime)
                      : null
                  }
                  onChange={(dateTime) => createTaskFormik.setFieldValue("dateTime", dateTime)}
                  placeholderText="Task start"
                  dateFormat="yyyy/MM/dd h:mm aa"
                  minDate={todayDateOnly}
                  maxDate={todayDateOnly}
                  showTimeSelect
                  timeIntervals={15}
                  className="border rounded px-2 py-1 text-sm w-40"
                  minTime={
                    createTaskFormik.values.dateTime && isToday(new Date(createTaskFormik.values.dateTime))
                    ? roundUpToNext15(now):minSelectableTime}
                  maxTime={maxSelectableTime}
                />
              </div>

              {/* Title */}
              <div className="flex flex-col w-full max-w-xs mx-auto">
                <label className="text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={createTaskFormik.values.title}
                  onChange={createTaskFormik.handleChange}
                  onBlur={createTaskFormik.handleBlur}
                />
              </div>

              {/* Duration */}
              <div className="flex flex-col w-full max-w-xs mx-auto">
                <label className="text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 1h 30m"
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={createTaskFormik.values.duration}
                  onChange={createTaskFormik.handleChange}
                  onBlur={createTaskFormik.handleBlur}
                />
              </div>

              {/* Status */}
              <div className="flex flex-col w-full max-w-xs mx-auto">
                <label className="text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={createTaskFormik.values.status}
                  onChange={createTaskFormik.handleChange}
                  onBlur={createTaskFormik.handleBlur}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                </select>
              </div>

              {/* Color */}
              <div className="flex flex-col w-full max-w-xs mx-auto">
                <label className="text-sm font-medium mb-1">Color</label>
                <div className="relative">
                  <button
                    type="button"
                    className="border border-gray-300 bg-white rounded px-2 py-1 text-sm text-left flex items-center justify-between w-full"
                    onClick={() => setColorDropDown(!colorDropDown)}
                  >
                    <span className="flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-2 "
                        style={{ backgroundColor: createTaskFormik.values.color }}
                      />
                      {colorOptions.find((c) => c.value === createTaskFormik.values.color)?.name || "Select Color"}
                    </span>
                    <span>▾</span>
                  </button>

                  {colorDropDown && (
                    <div className="absolute z-10 bg-white border rounded shadow-md mt-1 w-full ">
                      {colorOptions.map((color) => (
                        <div
                          key={color.value}
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => {
                            createTaskFormik.setFieldValue("color", color.value);
                            setColorDropDown(false);
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
              </div>
            </div>

            {/* Content Field (Full Width) */}
            <div className="flex flex-col w-full max-w-xs mx-auto">
              <label className="text-sm font-medium mb-1">Content</label>
              <textarea
                name="content"
                className="border rounded px-2 py-1 text-sm min-h-[100px] resize-y w-full "
                placeholder="e.g. 2 sets of bench press, 10 push-ups, and stretch"
                maxLength={500}
                value={createTaskFormik.values.content}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              <div className="text-xs text-gray-500 mt-1 ">
                {(createTaskFormik.values.content || "").length}/500
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="text-sm bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
        ))}
    </div>

  );
};

export default CreateCurrentDayTask;

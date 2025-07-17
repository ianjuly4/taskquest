import React, {useState, useContext} from "react";
import { MyContext } from "./MyContext";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTask = () =>{
  const {user, isLoggedIn} = useContext(MyContext)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formSchema = yup.object().shape({
    date: yup.date().required('Date is required').min(today, "Date must be today or in the future"),
    title: yup.string().required("Title is required").max(100),
    category: yup.string().max(50, 'Category too long'),
    duration: yup.string().matches(/^(\d+\s*h)?\s*(\d+\s*m)?$/, "Use format like '1h 30m'"),
    dueDateTime: yup.date().min(today, "Date must be today or in the future"),
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

      const formattedDate = values.date ? values.date.toISOString().split('T')[0] : null;
      const formattedDueDateTime = values.dueDateTime ? values.dueDateTime.toISOString() : null;

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

  return(
    <div className="w-full bg-gray-300 text-black border-4 border-gray-300 rounded-3xl p-4">
      {/* Header row */}
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
      {dropdownOpen && (!isLoggedIn && !user ? (
        <div className="text-red-500 text-sm">Please Log in to use this feature</div>
      ):(
        <form onSubmit={createTaskFormik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-4 mt-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Date</label>
              <DatePicker
                selected={createTaskFormik.values.date}
                onChange={(date) => createTaskFormik.setFieldValue('date', date)}
                placeholderText="current/future date"
                dateFormat="yyyy/MM/dd"
                className="border rounded px-2 py-1 text-sm w-[150px]"

              />
                {createTaskFormik.touched.date && createTaskFormik.errors.date && (
                  <div className="text-red-500 text-sm">{createTaskFormik.errors.date}</div>
                )}
          </div> 
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                className="border rounded px-2 py-1 text-sm"
                placeholder="ex. go to gym"
                value={createTaskFormik.values.title}
                onChange={createTaskFormik.handleChange}
                onBlur={createTaskFormik.handleBlur}
              />
              {createTaskFormik.touched.title && createTaskFormik.errors.title && (
                <div className="text-red-500 text-sm">{createTaskFormik.errors.title}</div>
              )}
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="ex. exercise"
                  value={createTaskFormik.values.category}
                  onChange={createTaskFormik.handleChange}
                  onBlur={createTaskFormik.handleBlur}
                />
                {createTaskFormik.touched.category && createTaskFormik.errors.category && (
                  <div className="text-red-500 text-sm">{createTaskFormik.errors.category}</div>
                )}
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="ex. 1h30min"
                  value={createTaskFormik.values.duration}
                  onChange={createTaskFormik.handleChange}
                  onBlur={createTaskFormik.handleBlur}
                />
                {createTaskFormik.touched.duration && createTaskFormik.errors.duration && (
                  <div className="text-red-500 text-sm">{createTaskFormik.errors.duration}</div>
                )}
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Due Date and Time</label>
               <DatePicker
                  selected={createTaskFormik.values.dueDateTime}
                  onChange={(date) => createTaskFormik.setFieldValue('dueDateTime', date)}
                  placeholderText="Select date and time"
                  dateFormat="yyyy/MM/dd h:mm aa"   
                  showTimeSelect                     
                  timeIntervals={15}                 
                  timeCaption="Time"
                  className="border rounded px-2 py-1 text-sm w-[150px]"
                />

                {createTaskFormik.touched.dueDateTime && createTaskFormik.errors.dueDateTime && (
                  <div className="text-red-500 text-sm">{createTaskFormik.errors.dueDateTime}</div>
                )}
          </div>
          
        </form>
      )
    )}
    </div>
    )
}
export default CreateTask;


// const DurationHelper = () => {
//   const [showHelper, setShowHelper] = useState(false);

//   return (
//     <div className="relative">
//       <label className="text-sm font-medium mb-1 flex items-center">
//         Duration
//         <button
//           type="button"
//           onClick={() => setShowHelper(!showHelper)}
//           className="ml-2 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
//           aria-label="Toggle duration help"
//         >
//           ?
//         </button>
//       </label>

//       {showHelper && (
//         <div className="absolute z-10 bg-white border rounded p-2 mt-1 w-60 text-xs shadow-md">
//           Please enter duration like "1h 30m" or "45m". Hours and minutes are optional.
//         </div>
//       )}
//     </div>
//   );
// };
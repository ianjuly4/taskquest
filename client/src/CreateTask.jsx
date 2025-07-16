import React, {useState, useContext} from "react";
import { MyContext } from "./MyContext";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTask = () =>{
  const {user, isLoggedIn} = useContext(MyContext)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username.").max(25),
    password: yup.string().required("Must enter a password").max(25),
  });
  
  const createTaskFormik = useFormik({
    initialValues: {
    date: "",
    title: "",
    category: "",
    durationMinutes: "",
    dueDateTime: "",
    status: "",
    color: "",
    colorMeaning: "",
    repeat: "",
    comments: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      const success = await createTask(values.date, values.title, values.category, values.durationMinutes, dueDateTime, values.status, values.color, values.colorMeaning, values.repeat, values.comments);
      
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
                  name="durationMinutes"
                  className="border rounded px-2 py-1 text-sm"
                  value={createTaskFormik.values.durationMinutes}
                  onChange={createTaskFormik.handleChange}
                  onBlur={createTaskFormik.handleBlur}
                />
                {createTaskFormik.touched.durationMinutes && createTaskFormik.errors.durationMinutes && (
                  <div className="text-red-500 text-sm">{createTaskFormik.errors.durationMinutes}</div>
                )}
          </div>
          
        </form>
      )
    )}
    </div>
    )
}
export default CreateTask;
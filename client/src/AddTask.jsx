import React, {useState} from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddTask = () =>{
    const [startDate, setStartDate] = useState(new Date());

    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter a username.").max(25),
        password: yup.string().required("Must enter a password").max(25),
      });
    
      const loginFormik = useFormik({
        initialValues: {
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
          const success = await createTask(values.title, values.category, values.durationMinutes, dueDateTime, values.status, values.color, values.colorMeaning, values.repeat, values.comments);
         
        },
      });
    return(
        <div className="w-full h-20 bg-gray-300 text-black border-4 border-gray-300 rounded-3xl flex  justify-between px-4">
              <h1 className="text-xl font-bold">Create Task</h1>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy/MM/dd"
                />
        </div>
    )
}
export default AddTask;
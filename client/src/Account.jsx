// Account.jsx
import React, { useContext, useState } from 'react';
import Header from "./Header";
import { MyContext } from './MyContext';
import { useFormik } from "formik";
import * as yup from "yup";

function Account() {
  const { signup, setError, error, user, setUser, isLoggedIn } = useContext(MyContext);
  const {username} = user || []
  
  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username.").max(50),
    password: yup.string().required("Must enter a password").max(50),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      await signup(values.username, values.password);
    },

  });

  return (
    <div className="max-w-3xl mx-auto flex flex-col rounded-3xl p-6 overflow-hidden h-screen">
      <Header />
      <div className="border-4 bg-gray-300 black-text flex flex-col rounded-3xl p-6 mt-4 ">
        
      {/*Create Account Form */}
      {!isLoggedIn && !user ? (
        <form className="flex flex-col items-center justify-center" onSubmit={formik.handleSubmit}>
          {/* Username Field */}
          <div className="form-control flex flex-row items-center gap-4 justify-center my-2 w-full max-w-md">
            <label className="min-w-[90px] text-right font-medium">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="input input-bordered flex-1"
              placeholder="Enter username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.username && formik.errors.username && (
            <div className="text-red-500 text-sm text-center">{formik.errors.username}</div>
          )}

          {/* Password Field */}
          <div className="form-control flex flex-row items-center gap-4 justify-center my-2 w-full max-w-md">
            <label  className="min-w-[90px] text-right font-medium">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input input-bordered flex-1"
              placeholder="Enter password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm text-center">{formik.errors.password}</div>
          )}

          {/* Submit Button */}
          <div className="form-control mt-6 w-full max-w-md">
            <button type="submit" className="btn btn-primary w-full">
              Create Account
            </button>
            {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
          </div>
        </form>
        ):(<div>
         Welcome back, {username}
        </div>)}
      </div>
    </div>
  );
};

export default Account;

import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { MyContext } from './MyContext';
import { useFormik } from "formik";
import * as yup from "yup";

const NavBar = () => {
  const { error, login, logout, user, isLoggedIn } = useContext(MyContext);
  const [loginDropDownOpen, setLoginDropDownOpen] = useState(false);
  const [createDropDownOpen, setCreateDropDownOpen] = useState(false)
  const [dateTime, setDateTime] = useState(new Date());


  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());  
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username.").max(25),
    password: yup.string().required("Must enter a password").max(25),
  });

  const loginFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      const success = await login(values.username, values.password);
      if (success) {
        setLoginDropDownOpen(false);
      }
    },
  });

  const formattedDateTime = dateTime.toLocaleString();

  
  return (
    <div className="text-sm font-medium flex items-center space-x-4 relative">
      {/* Current Time */}
      <div>{formattedDateTime}</div>

      {/*Create Account */}
      <div className="flex items-center space-x-2">
          <button
            className="bg-white text-black px-2 py-2 rounded-lg shadow"
            onClick={()=>setCreateDropDownOpen(!createDropDownOpen)}
          >
            Create Account
          </button>
        </div>
      {createDropDownOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-20"
              onMouseLeave={()=>setCreateDropDownOpen(!createDropDownOpen)}
            >
              <form onSubmit={loginFormik.handleSubmit}>
                <label className="block mb-2 text-black font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input input-bordered w-full mb-2"
                  value={loginFormik.values.username}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                />
                {loginFormik.touched.username && loginFormik.errors.username && (
                  <div className="text-red-500 text-sm">{loginFormik.errors.username}</div>
                )}

                <label className="block mb-2 text-black font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered w-full mb-2"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                />
                {loginFormik.touched.password && loginFormik.errors.password && (
                  <div className="text-red-500 text-sm">{loginFormik.errors.password}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 rounded hover:bg-blue-700"
                >
                  Enter
                </button>
                {error && (
                  <div className="text-red-500 text-xs mt-2 text-center">{error}</div>
                )}
              </form>
            </div>
          )}
       

      {/* Auth Buttons */}
      {isLoggedIn && user ? (
        <div className="flex items-center space-x-2">
          {/*<span className="text-gray-700">Hi, {user.username}!</span>*/}
          <button
            className="bg-white text-black px-2 py-2 rounded-lg shadow"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <button
            className="bg-white text-black px-2 py-2 rounded-lg shadow"
            onClick={()=>setLoginDropDownOpen(!loginDropDownOpen)}
          >
            Login
          </button>

          {/* Login Dropdown */}
          {loginDropDownOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-20"
              onMouseLeave={()=>setLoginDropDownOpen(!loginDropDownOpen)}
            >
              <form onSubmit={loginFormik.handleSubmit}>
                <label className="block mb-2 text-black font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input input-bordered w-full mb-2"
                  value={loginFormik.values.username}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                />
                {loginFormik.touched.username && loginFormik.errors.username && (
                  <div className="text-red-500 text-sm">{loginFormik.errors.username}</div>
                )}

                <label className="block mb-2 text-black font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered w-full mb-2"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                />
                {loginFormik.touched.password && loginFormik.errors.password && (
                  <div className="text-red-500 text-sm">{loginFormik.errors.password}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Enter
                </button>
                {error && (
                  <div className="text-red-500 text-xs mt-2 text-center">{error}</div>
                )}
              </form>
            </div>
          )}
        </>
      )}

      {/* NavLink to Account Page */}
      <NavLink to="/account">
        <button className="bg-white text-black px-2 py-2 rounded-lg shadow">
          Profile
        </button>
      </NavLink>
    </div>
  );
};

export default NavBar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="text-sm font-medium flex items-center space-x-2 relative">
      {/* Login button */}
      <button
        className="bg-white text-black px-2 py-2 rounded-lg shadow"
        onClick={handleDropdownToggle}
      >
        Login
      </button>

      {/* Dropdown: shows when dropdownOpen is true */}
      {dropdownOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-20"
          onMouseLeave={handleDropdownClose}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Submit login form");
              setDropdownOpen(false);
            }}
          >
            <label className="block mb-2 text-black font-semibold" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full mb-3 px-2 py-1 border rounded"
              placeholder="Enter username"
              required
            />

            <label className="block mb-2 text-black font-semibold" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mb-3 px-2 py-1 border rounded"
              placeholder="Enter password"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* NavLink for Account */}
      <NavLink to="/account">
        <button className="bg-white text-black px-2 py-2 rounded-lg shadow">
          Account
        </button>
      </NavLink>
    </div>
  );
};

export default NavBar;

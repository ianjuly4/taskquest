import React from "react";
import NavBar from "./NavBar";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="relative w-full h-40 bg-gray-300 text-black border-4 border-gray-300 rounded-3xl">
    
      <h1 className="absolute top-4 left-4 text-xl font-bold">
        <NavLink to="/">Taskquest</NavLink>
      </h1>

    
      <div className="absolute bottom-4 right-4">
        <NavBar />
      </div>
    </div>
  );
};

export default Header;

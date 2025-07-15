import React from "react";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <div className="w-full h-20 bg-gray-300 text-black border-4 border-gray-300 rounded-3xl flex items-center justify-between px-4">
      <h1 className="text-xl font-bold">Taskquest</h1>
      <NavBar />
    </div>
  );
};

export default Header;

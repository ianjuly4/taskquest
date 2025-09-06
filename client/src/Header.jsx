import React, {useState, useEffect} from "react";
import NavBar from "./NavBar";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
      const timer = setInterval(() => {
        setDateTime(new Date());  
      }, 1000);
      return () => clearInterval(timer);
    }, []);

  const formattedDateTime = dateTime.toLocaleString();
  
  return (
    <div className="sticky top-0 z-30 h-40 bg-gray-300 text-black border-4 border-gray-300 rounded-3xl title-bar">
      <h1 className="absolute top-4 left-4 text-xl font-bold">
        <NavLink to="/">Taskquest</NavLink>
      </h1>
      {/* Current Time */}
      <div className="absolute top-4 right-4 text-sm font-medium no-drag">
        {formattedDateTime}
      </div>

      <div className="absolute bottom-4 right-4 no-drag">
        <NavBar />
      </div>
    </div>
  );
};

export default Header;

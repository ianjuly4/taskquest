import React, { createContext, useState, useEffect } from "react";

const MyContext = createContext();


const MyContextProvider = ({children}) =>{
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const signup = async (username, password) => {
  setError(null);
  setLoading(true); 
  try {
    const response = await fetch("http://127.0.0.1:5555/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Signup failed");
    }
    setIsLoggedIn(true);
    setUser(data);
    return true;
  } catch (error) {
    setError(error.message);
    console.log(error)
    return false; 
  } finally {
    setLoading(false);
  }
};

    
 return (
    <MyContext.Provider
      value={{
        signup,
        user,
        setUser,
        setError,
        error
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };

import React, { createContext, useState, useEffect } from "react";

const MyContext = createContext();


const MyContextProvider = ({children}) =>{
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const signup = async (username, password) => {
  setError(null);
  setLoading(true); // optional, if you're using loading somewhere

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
    return true; // ✅ RETURN SUCCESS
  } catch (error) {
    setError(error.message);
    return false; // ✅ RETURN FAILURE
  } finally {
    setLoading(false);
  }
};

    
 return (
    <MyContext.Provider
      value={{
        signup,
        user
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };

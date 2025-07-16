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
  setIsLoggedIn(false)
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

 const login = (username, password) => {
    setLoading(true);
    setError(null);

    return fetch("http://127.0.0.1:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.user && data.user.id) {
          setUser(data.user);
          setIsLoggedIn(true);
          //console.log("Login successful", data.user);
          return true;
        } else if (data.error) {
          console.log(data.error);
          setError(data.error + " An error occurred. Please try again.");
          return false;
        }
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message || "An error occurred. Please try again later.");
        return false;
      })
      .finally(() => {
        setLoading(false);
      });
  };

    
 return (
    <MyContext.Provider
      value={{
        signup,
        user,
        setUser,
        setError,
        error,
        login,
        isLoggedIn
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };

import React, { createContext, useState, useEffect } from "react";

const MyContext = createContext();

const MyContextProvider = ({children}) =>{
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([])
  const [dates, setDates] = useState([])
  const [dateTime, setDateTime] = useState(new Date());

  //deleteTask
  const deleteTask = (taskId ) => {
  setLoading(true);
  setError(null);

  fetch(`http://localhost:5555/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setUser((prevUser) => {
        const updatedDates = prevUser.dates.map((date) => ({
          ...date,
          tasks: date.tasks.filter((task) => task.id !== taskId),
        }));
        return { ...prevUser, dates: updatedDates };
      });
      setError("Task deleted successfully!");
    })
    .catch((error) => {
      setError(error.message + " Error deleting task. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  //updateTask
  const updateTask = (taskId, values)=>{
    return fetch(`http://localhost:5555/tasks/${taskId}`,{
      method: "PATCH",
      headers: {"Content-Type": "application/json",},
      credentials: "include",
      body: JSON.stringify(values)
    })
    .then(async (response) => {
      const data = await response.json(); 
      console.log(data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update task");
      }
      setUser(data)
      return true;
    })
    .catch((error) => {
      console.error("Task update error:", error.message);
      setError("Error updating task: " + error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }
  

  //createTask
  const createTask = (
    formattedDate,
    title,
    totalMinutes,
    status,
    color,
    content
    ) => {
    setLoading(true);
    setError(null);

    const requestBody = {
      dateTime: formattedDate, 
      title,
      duration: totalMinutes, 
      status,
      color,
      content
    };

    return fetch("http://localhost:5555/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    })
    .then(async (response) => {
      const data = await response.json();
      console.log(data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }
      setUser(data)
      return true;
    })
    .catch((error) => {
      console.error("Task creation error:", error.message);
      setError("Error creating task: " + error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }
  
  //checksession
  useEffect(() => {
    fetch("http://localhost:5555/check_session", {
      method: "GET",
      credentials: "include"
    })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Not logged in");
      })
      .then((data) => {
        setUser(data.user);
        setDates(data.user?.dates || [])
        setTasks(data.user?.tasks || [])
        console.log(data)
        setIsLoggedIn(true);
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
        setDates([]),
        setTasks([])
      });
    }, []);


  //signup
  const signup = async (username, password) => {
    setError(null);
    setLoading(true); 
    setIsLoggedIn(false)
    try {
      const response = await fetch("http://localhost:5555/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
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

  //Login
  const login = (username, password) => {
    setError(null);

    return fetch("http://localhost:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.user && data.user.id) {
          setUser(data.user);
          setIsLoggedIn(true);
          setDates(data.user?.dates || [])
          setTasks(data.user?.tasks || [])
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

  //logout
  const logout = async () => {
    try{
      const response = await fetch("http://localhost:5555/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      })
      if(!response.ok){
        const data = await response.json();
        throw new Error(data?.error || 'Failed to logout')
      }
      setError(null)
      setUser(null);
      setIsLoggedIn(false);
     }catch(error) {
      console.log('logout failed:', error)
      setError("Logout Error: " + error.message);
      };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());  
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  

    
 return (
    <MyContext.Provider
      value={{
        signup,
        user,
        setUser,
        setError,
        error,
        login,
        isLoggedIn,
        logout, 
        createTask, 
        tasks,
        dates,
        deleteTask,
        loading,
        dateTime,
        updateTask

      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };

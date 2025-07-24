import React, {useState, useContext} from "react";
import { MyContext } from "./MyContext";
import TaskCard from "./TaskCard";

const TimeSlots = () =>{
    const { user } = useContext(MyContext);
    const dates = user?.dates || []; 
    //console.log(user)

    const timeSlots = Array.from({ length: 24 * 2}, (_, i)=>{
        const hour = Math.floor(i/2);
        const minutes = i % 2 === 0 ? "00" : "30";
        const time = new Date();
        time.setHours(hour)
        time.setMinutes(minutes)
        return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    })

    const now = new Date();
    // Find today's date object that belongs to this user
    const today = dates.find((d) => {
        const date = new Date(d.date_time.replace(" ", "T")+ "Z");
    
        return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
        );
    });
    console.log("Today's matched date object:", today);
   
    console.log(today?.tasks)
    const time = today?.date_time;
    const todayTasks = (today?.tasks || []).map((task) => ({
        ...task,
        startTime: new Date(today.date_time.replace(" ", "T") + 'Z')
        }));

    


  return(
    <div className="w-full">
        {timeSlots.map((slot, index) => {
            const tasksForSlot = todayTasks.filter((task)=>{
                
                const taskTime = task.startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                console.log(taskTime)
                return taskTime === slot
            }) || [];
            
            return(
            <div key={index} 
                className="flex items-start justify-between h-12 border-t border-gray-200 px-4">
                <div className="flex-grow">
                    {tasksForSlot.map((task)=>(
                        <TaskCard key={task.id} task={task}/>
                    ))}
                </div>
                <div className="text-xs text-gray-500 w-20 text-right shrink-0">
                    {slot}
                </div>
            </div>
            )
        })}  
    </div>
  )
}
export default TimeSlots
import React, {useState, useContext} from "react";
import { MyContext } from "./MyContext";
import TaskCard from "./TaskCard";
import { DateSchema } from "yup";

const TimeSlots = ({handleCompleteTask}) =>{
    const { user, deleteTask } = useContext(MyContext);
    const [openTaskId, setOpenTaskId] = useState(null)
    const dates = user?.dates || []; 
   
    //console.log(dates)

    const timeSlots = Array.from({ length: 24 *4 }, (_, i)=>{
        const hour = Math.floor(i/4);
        const quarter = i % 4;
        const minutes = (quarter * 15).toString().padStart(2, '0')
        const time = new Date();
        time.setHours(hour)
        time.setMinutes(minutes)
        return time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    })

    const now = new Date();
 
    const today = dates.filter((d) => {
        const date = new Date(d.date_time.replace(" ", "T")+ "Z");
    
        return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
        );
    });
    //console.log("Today's matched date object:", today);
   
    //console.log(today?.tasks)
    const time = today?.date_time;
    const todayTasks = today.flatMap((d) =>
        (d.tasks || []).map((task) => ({
        ...task,
        startTime: new Date(d.date_time.replace(" ", "T") + "Z"),
        }))
    );
    
    return(
        <div className="w-full">
            {timeSlots.map((slot, index) => {
                const tasksForSlot = todayTasks.filter((task)=>{
                    const taskTime = task.startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    
                    return taskTime === slot
                }) || [];
                
                return(
                <div key={index} 
                    className="flex items-start justify-between h-12 border-t border-gray-200 px-4">
                    <div className="flex-grow">
                        {tasksForSlot.map((task) => (
                        <div
                            key={task.id} 
                            className={openTaskId === task.id ? "relative z-50" : ""}
                        >
                            <TaskCard
                            task={task}
                            deleteTask={deleteTask}
                            isOpen={openTaskId === task.id}
                            handleCompleteTask={handleCompleteTask}
                            onToggle={() =>
                                setOpenTaskId(openTaskId === task.id ? null : task.id)
                            }
                            />
                        </div>
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
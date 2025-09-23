import React, {useState, useContext} from "react";
import { MyContext } from "./MyContext";
import TaskCard from "./TaskCard";
import { DateSchema } from "yup";

const TimeSlots = ({handleCompleteTask}) =>{
    const { user, deleteTask, updateTask, questStarted, setError } = useContext(MyContext);
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

    const todayTasks = today.flatMap((d) =>
        (d.tasks || []).map((task) => ({
        ...task,
        startTime: new Date(d.date_time.replace(" ", "T") + "Z"),
        }))
    );
    
    return (
        <div className="relative w-full max-h-[400px] overflow-y-auto overflow-x-hidden border border-gray-300 rounded-md p-2 pb-24">
            {/* Background time slots */}
            <div>
                {timeSlots.map((slot, index) => (
                    <div
                        key={index}
                        className="border-t border-gray-200 min-h-[48px] flex justify-between px-2"
                        style={{ height: "48px" }}
                    >
                        <div className="flex-grow"></div>
                        <div className="text-xs text-gray-500 w-12 text-right pl-2">
                            {slot}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Absolute-positioned TaskCards */}
            {todayTasks.map((task) => {
                const start = task.startTime;
                const startHour = start.getHours();
                const startMinutes = start.getMinutes();
                const startIndex = startHour * 4 + Math.floor(startMinutes / 15);
                const top = startIndex * 48;

                // Fallback duration: 15 mins (1 slot)
                const duration = task.duration || 15;
                const durationSlots = Math.ceil(duration / 15);
                const baseHeight = durationSlots * 48;

                const height = openTaskId === task.id ? "auto" : `${baseHeight}px`;

                return (
                    <div
                        key={task.id}
                        className={`absolute left-0 right-10 px-2 ${openTaskId === task.id ? "z-40" : ""}`}
                        style={{
                            top: `${top}px`,
                            minHeight: `${baseHeight}px`,
                            height: height,
                        }}
                    >
                        <TaskCard
                            task={task}
                            deleteTask={deleteTask}
                            isOpen={openTaskId === task.id}
                            handleCompleteTask={handleCompleteTask}
                            updateTask={updateTask}
                            questStarted={questStarted}
                            setError={setError}
                            onToggle={() =>
                                setOpenTaskId(openTaskId === task.id ? null : task.id)
                            }
                        />
                    </div>
            );
        })}

          
        </div>
    );
};

export default TimeSlots;
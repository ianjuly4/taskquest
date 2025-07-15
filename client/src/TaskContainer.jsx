import React, {useState} from "react";
import TaskCard from "./TaskCard.jsx"

const TaskContainer = () => {

    return(
        <div className='border-4 border-gray-300 black-text flex flex-col rounded-3xl p-6 '>
            TaskContainer
            <TaskCard/>
        </div>
    )
}
export default TaskContainer;
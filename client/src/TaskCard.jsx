import React, {useState} from "react"

const TaskCard = ({task}) =>{
    const {
        category, 
        color, 
        color_meaning, 
        comments, 
        content, 
        due_datetime, 
        duration_minutes, 
        repeat, 
        status, 
        title, } = task

    return(
        <div className="border-4 border-gray-300 black-text flex flex-col rounded-3xl mt-2" 
            style={{backgroundColor: color}}>
            <h1 className="texts-xl font-bold">{title}</h1>
            <p className="text-m text-gray-700">• Category = {category}</p>
            <p className="text-m text-gray-700"> • Color Meaning = {color_meaning}</p>
            <p className="text-m text-gray-700">{content}</p>

            
        </div>
    )
}
export default TaskCard;

      
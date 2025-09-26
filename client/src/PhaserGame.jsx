import React, {useEffect, useContext, useState} from "react"
import Phaser from "phaser"
import Quest from "./Quest"
import { MyContext } from "./MyContext";
import MainMenu from "./MainMenu";

const PhaserGame = ({testMode=false}) =>{
    const {user, onStartQuest} = useContext(MyContext)
    const dates = user?.dates
    
    

    const isToday = (dateStr) => {
        if(!dateStr || typeof dateStr !== 'string') return false;

        const date = new Date(dateStr.replace(" ", "T") + "Z");
        const now = new Date();
        return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
        );
    };

    const todayEntries = dates?.filter((d) => isToday(d.date_time)) || [];
    const allTodaysTasks = todayEntries.flatMap((entry) => entry.tasks || []);
    

    

    const calculateDayDuration = () => {
        if (!todayEntries || todayEntries.length === 0) {
            console.log("No entries for today");
            return null;
        }

  
        const sortedEntries = [...todayEntries].sort((a, b) =>
            new Date(a.date_time.replace(" ", "T")) - new Date(b.date_time.replace(" ", "T"))
        );


        const start = new Date(sortedEntries[0].date_time.replace(" ", "T"));

     
        const lastEntry = sortedEntries[sortedEntries.length - 1];
        const lastStart = new Date(lastEntry.date_time.replace(" ", "T"));

      
        const lastTask = lastEntry.tasks?.[0];
        const lastDuration = lastTask?.duration || 0;

        const end = new Date(lastStart.getTime() + lastDuration * 60000);


        const durationMs = end - start;

        const durationMinutes = Math.floor(durationMs / 60000);

        //console.log("🕒 Start:", start.toLocaleTimeString());
        //console.log("🕔 End:", end.toLocaleTimeString());
        //console.log("📅 Total Day Duration:", durationMinutes, "minutes");
        //console.log(durationMinutes)
    
        return durationMinutes;
       
        };
       
    
    useEffect(()=>{
        if(!user || allTodaysTasks.length < 3) return

            const duration = calculateDayDuration()
            const config = {
                type: Phaser.AUTO,
                width: 370,
                height: 170,
                backgroundColor:  "#D1D5DB",
                parent: "phaser-container",
                physics: {
                    default: "arcade",
                    arcade: {
                    gravity: { y: 0 },
                    debug: false,
                    },
                },
                scene: [
                    MainMenu,
                    Quest
                    ],
                callbacks: {
                    postBoot: (game) => {
                    game.registry.set("onStartQuest", onStartQuest); 
                    },
                    },
            };

            const game = new Phaser.Game(config);

            if(testMode === true){
                game.scene.start('MainMenu', {test: true, user, tasks: allTodaysTasks, dayDuration: duration})
            }else{
                game.scene.start('MainMenu', {test: false, user, tasks: allTodaysTasks, dayDuration: duration})
            }
            return () => {
            game.destroy(true); 
            };
        }, [testMode, allTodaysTasks.length]);

  return (
    <div>
        {user && allTodaysTasks.length >=3 ? (
            <div
                id="phaser-container"
                className="w-full h-[200px] bg-gray-300 text-black border-4 border-gray-300 justify-center rounded-3xl p-4 mt-4"
            >
            </div>
            ):(
                <div className="w-full h-[200px] bg-gray-300 text-black border-4 border-gray-300 justify-center rounded-3xl p-4 mt-4">
                {user? "You need at least 3 tasks to start a quest.": "Please log in to start a quest"}</div>
            )}

    </div>
  
    )
};


export default PhaserGame;
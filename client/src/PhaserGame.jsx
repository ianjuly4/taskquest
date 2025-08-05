import React, {useEffect, useContext, useState} from "react"
import Phaser from "phaser"
import Quest from "./Quest"
import { MyContext } from "./MyContext";
import MainMenu from "./MainMenu";

const PhaserGame = ({testMode=false}) =>{
    const {user, setQuestStarted} = useContext(MyContext)
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
    //console.log(todayEntries)
    //console.log(allTodaysTasks)
    const onStartQuest = () =>{
        setQuestStarted(true)
    }
    useEffect(()=>{
        if(!user) return
        const config = {
            type: Phaser.AUTO,
            width: 300,
            height: 100,
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

            if(testMode){
                game.scene.start('MainMenu', {test: true, user, tasks: allTodaysTasks})
            }
            return () => {
            game.destroy(true); 
            };
        }, [testMode, user]);

  return (
    <div>
        {user  ? (
            <div
                id="phaser-container"
                className="w-full h-[200px] bg-gray-300 text-black border-4 border-gray-300 justify-center rounded-3xl p-4 mt-4"
            >
            </div>):(
                <div className="w-full h-[200px] bg-gray-300 text-black border-4 border-gray-300 justify-center rounded-3xl p-4 mt-4">Please Log in to start a quest</div>
            )}
    </div>
  
    )
};


export default PhaserGame;
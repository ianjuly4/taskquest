import React, {useEffect} from "react"
import Phaser from "phaser"
import Quest from "./Quest"

const PhaserGame = () =>{
    useEffect(()=>{
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
                //Quest
                ],
            };

            const game = new Phaser.Game(config);

            return () => {
            game.destroy(true); 
            };
        }, []);

  return (
    <div
        id="phaser-container"
        className="w-full h-[200px] bg-gray-300 text-black border-4 border-gray-300 justify-center rounded-3xl p-4 mt-4"
    >
    </div>

  
    )
};


export default PhaserGame;
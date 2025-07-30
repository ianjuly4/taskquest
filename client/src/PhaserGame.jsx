import React, {useEffect} from "react"
import Phaser from "phaser"
import Quest from "./Quest"

const PhaserGame = () =>{
    useEffect(()=>{
        const config = {
            type: Phaser.AUTO,
            width: 600,
            height: 200,
            parent: "phaser-container",
            physics: {
                default: "arcade",
                arcade: {
                gravity: { y: 0 },
                debug: false,
                },
            },
            scene: [Quest],
            };

            const game = new Phaser.Game(config);

            return () => {
            game.destroy(true); 
            };
        }, []);

  return <div id="phaser-container" className="w-full bg-gray-300 text-black border-4 border-gray-300 rounded-3xl p-4"></div>
};

export default PhaserGame;
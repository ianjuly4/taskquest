import {BackgroundThemes} from "./BackgroundThemes"

export function Preload(){
    //Heros
    this.load.spritesheet('ArcherWalk', 'assets/heros/Archer/Walk.png', {frameWidth: 1024/8, frameHeight:128})
    
    this.load.image("heart", "assets/8.png")

    for (const [theme, { folder, keys }] of Object.entries(BackgroundThemes)) {
        keys.forEach((imageKey, index) => {
            const imagePath = `assets/backgrounds/${folder}/${index + 1}.png`;
            this.load.image(imageKey, imagePath);
        });
    }

    this.backgroundThemes = BackgroundThemes
}
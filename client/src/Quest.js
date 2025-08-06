import Phaser from 'phaser'
import {Preload} from "./Preload"
export default class Quest extends Phaser.Scene{
    constructor(){
        super('Quest')
    }
    init(data){
        this.testMode = data.test || false
        this.user = data.user || null
        this.tasks = data.tasks || []
    }
    
    preload(){
        Preload.call(this)
        
    }
    create(){
        const {width, height} = this.scale

        this.setBackgroundByTime()

        const ground1Height = this.textures.get('nature2_3').getSourceImage().height;
        const ground2Height = this.textures.get('nature2_4').getSourceImage().height;

        this.add.image(0, 0, 'nature2_1').setOrigin(0).setDepth(-3).setDisplaySize(width, height);
        this.bgClouds = this.add.tileSprite(0, 0, width, height, 'nature2_2').setOrigin(0).setDepth(-2)
        this.bgGround1 = this.add.tileSprite(0, height - ground1Height, width, ground1Height, 'nature2_3')
            .setOrigin(0)
            .setDepth(-1);

        this.bgGround2 = this.add.tileSprite(0, height - ground2Height, width, ground2Height, 'nature2_4')
            .setOrigin(0)
            .setDepth(0);
        console.log(this.bgGround1.x, this.bgGround1.y)
        console.log(this.bgClouds.x, this.bgClouds.y)
    
    
        const totalTasks = this.tasks.length
        const missed = this.tasks.filter(task => task.status === "incomplete").length
        const damagePerMissed = 3 / totalTasks;
        const damage = missed * damagePerMissed;

        this.health = Math.max(0, 3 - damage);


    }
    update(){
        this.bgClouds.tilePositionX += 0.2
        this.bgGround1.tilePositionX += 0.2
        this.bgGround2.tilePositionX += 0.2

    }
    setBackgroundByTime() {
        const hour = new Date().getHours();

        let alpha;
        if (hour >= 5 && hour < 12) {
            alpha = 0.1; 
        } else if (hour >= 12 && hour < 17) {
            alpha = 0; 
        } else if (hour >= 17 && hour < 21) {
            alpha = 0.25; 
        } else {
            alpha = 0.5; 
        }

        this.cameras.main.setBackgroundColor(alpha);
    }
}

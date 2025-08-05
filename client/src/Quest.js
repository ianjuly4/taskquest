import Phaser from 'phaser'

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

    }
    create(){
        this.setBackgroundByTime()

        this.background = this.add.image(150, 50, 'yourBackgroundImageKey');

        this.overlay = this.add.rectangle(150, 50, 300, 100, 0x000000, 0); 

        const totalTasks = this.tasks.length
        const missed = this.tasks.filter(task => task.status === "incomplete").length

        const damagePerMissed = 3 / totalTasks;
        const damage = missed * damagePerMissed;

        this.health = Math.max(0, 3 - damage);


    }
    update(){

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

        this.cameras.main.setBackgroundColor(color);
    }
}
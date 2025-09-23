import Phaser from 'phaser'

export default class MainMenu extends Phaser.Scene{
    constructor(){
        super('MainMenu')
    }

    init(data){
        this.testMode = data.test || false
        this.user = data.user || null
        this.tasks = data.tasks || []
        this.dayDuration = data.dayDuration || 0
    }
    preload(){

    }
    create(){
    
        const startTaskText = this.add.text(200, 80, 'Start Quest', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        startTaskText.on('pointerover', () => {
            startTaskText.setStyle({ fill: 'brown' }); 
        });
        
        startTaskText.on('pointerout', () => {
            startTaskText.setStyle({ fill: '#ffffff' }); 
        });

        startTaskText.on('pointerdown', () => {
            if (this.testMode) {
                const callback = this.game.registry.get('onStartQuest');

                if (callback) callback(); 
                this.scene.start('Quest', {
                    test: true,
                    user: this.user,
                    tasks: this.tasks
                });
                
            }else{
                const callback = this.game.registry.get('onStartQuest');

                if (callback) callback(); 
                this.scene.start('Quest', {
                    test: this.testMode,
                    user: this.user,
                    tasks: this.tasks,
                    dayDuration: this.dayDuration
                });
            }
        });
    }
    update(){

    }
    
}
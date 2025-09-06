import Phaser from 'phaser'

export default class MainMenu extends Phaser.Scene{
    constructor(){
        super('MainMenu')
    }

    init(data){
        this.testMode = data.test || false
        this.user = data.user || null
        this.tasks = data.tasks || []
        
    }
    preload(){

    }
    create(){
        const taskCount = this.tasks?.length || 0

        const startTaskText = this.add.text(200, 80, 'Start Quest', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        const warningText = this.add.text(200, 120,"",{
            fontFamily: 'Arial',
            fontSize: 14,
            color: '#ff0000',
            align: 'center'
        }).setOrigin(0.5);
      

        startTaskText.on('pointerover', () => {
            startTaskText.setStyle({ fill: 'brown' }); 
        });
        
        startTaskText.on('pointerout', () => {
            startTaskText.setStyle({ fill: '#ffffff' }); 
        });

        startTaskText.on('pointerdown', () => {
            if (this.testMode || taskCount >= 3) {
                const callback = this.game.registry.get('onStartQuest');
                if (callback) callback(); 
                this.scene.start('Quest', {
                    test: true,
                    user: this.user,
                    tasks: this.tasks
                });
                } else {
                warningText.setText('You need at least 3 tasks to start your quest!');
            }
        });
    }
    update(){

    }
    
}
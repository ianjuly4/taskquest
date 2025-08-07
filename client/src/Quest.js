import Phaser from 'phaser'
import { Preload } from './Preload'
import { BackgroundThemes } from './BackgroundThemes'

export default class Quest extends Phaser.Scene {
    constructor() {
        super('Quest')
    }

    init(data) {
        this.testMode = data.test || false
        this.user = data.user || null
        this.tasks = data.tasks || []

     
        this.backgroundThemes = BackgroundThemes
        this.stageThemes = []
        this.currentStage = 0
        this.backgroundLayers = []
    }

    preload() {
        Preload.call(this) 
    }

    create() {
        this.setBackgroundByTime()

        const themeKeys = Object.keys(this.backgroundThemes)
        this.stageThemes = Phaser.Utils.Array.Shuffle(themeKeys).slice(0, this.tasks.length)
        const initialTheme = this.stageThemes[0]
        this.currentTheme = initialTheme

        this.createBackground(initialTheme)

      
        this.archer = this.add.sprite(150, 130, 'ArcherWalk')
            .setOrigin(0.5, 1)
            .setDepth(3)
            .setScale(0.5)

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('ArcherWalk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })

        this.archer.play('walk')

       
            
            const totalTasks = this.tasks.length
        const missed = this.tasks.filter(task => task.status === "incomplete").length
        const damagePerMissed = 3 / totalTasks
        const damage = missed * damagePerMissed
        this.health = Math.max(0, 3 - damage)
    }

    update() {
       
        this.backgroundLayers?.forEach(({ layer, speed }) => {
            if (layer.tilePositionX !== undefined) {
                layer.tilePositionX += speed
            }
        })
    }

    setBackgroundByTime() {
        const hour = new Date().getHours()
        let alpha

        if (hour >= 5 && hour < 12) {
            alpha = 0.1 
        } else if (hour >= 12 && hour < 17) {
            alpha = 0 
        } else if (hour >= 17 && hour < 21) {
            alpha = 0.25 
        } else {
            alpha = 0.5 
        }

        this.cameras.main.setBackgroundColor(alpha)
    }

    createBackground(theme) {
        const keys = this.backgroundThemes[theme].keys;
        const { width, height } = this.scale;

        this.backgroundLayers = [];

        const maxLayers = keys.length;

        const scrollSpeeds = Array.from({ length: maxLayers }, (_, i) => i * 0.2);
        const depthLevels = Array.from({ length: maxLayers }, (_, i) => -maxLayers + i);

        keys.forEach((key, index) => {
            let layer;
            if (index === 0) {
         
            layer = this.add.image(0, 0, key)
                .setOrigin(0)
                .setDisplaySize(width, height)
                .setDepth(depthLevels[index]);
            } else {
       
            const imageHeight = this.textures.get(key).getSourceImage().height;
            const yPos = height - imageHeight;

            layer = this.add.tileSprite(0, yPos, width, imageHeight, key)
                .setOrigin(0)
                .setDepth(depthLevels[index]);
            }

            this.backgroundLayers.push({
            layer,
            speed: scrollSpeeds[index] ?? 0,
            });
        });
        }

    changeBackground(newTheme) {
      
        if (this.tweens.isTweening(this.cameras.main)) return

        this.tweens.add({
            targets: this.cameras.main,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
             
                this.backgroundLayers.forEach(({ layer }) => layer.destroy())
                this.backgroundLayers = []

                this.createBackground(newTheme)
                this.currentTheme = newTheme

                this.tweens.add({
                    targets: this.cameras.main,
                    alpha: 1,
                    duration: 1000
                })
            }
        })
    }

    advanceBackgroundStage() {
        if (this.currentStage + 1 >= this.stageThemes.length) return 

        this.currentStage++
        const nextTheme = this.stageThemes[this.currentStage]
        this.changeBackground(nextTheme)
    }
}

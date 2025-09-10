import Phaser from 'phaser'
import { Preload } from './Preload'

export default class Quest extends Phaser.Scene {
    constructor() {
        super('Quest')
    }

    init(data) {
        this.testMode = data.test || false
        this.user = data.user || null
        this.tasks = data.tasks || []
        this.dayDuration = data.dayDuration || 0
        this.backgroundThemes = BackgroundThemes
        this.isTransitioning = false
        this.transitionCount = 0
    }

    preload() {
        this.load.spritesheet('ArcherWalk', 'assets/heros/Archer/Walk.png', {
            frameWidth: 1024 / 8,
            frameHeight: 128
        })

        this.load.image("heart", "assets/8.png")

        for (const [theme, { folder, keys }] of Object.entries(BackgroundThemes)) {
            keys.forEach((imageKey, index) => {
                const imagePath = `assets/backgrounds/${folder}/${index + 1}.png`
                this.load.image(imageKey, imagePath)
            })
        }
    }

    create() {
        this.createBackground()
        console.log(this.tasks)
        this.archer = this.add.sprite(-50, 130, 'ArcherWalk')
            .setOrigin(0.5, 1)
            .setDepth(3)
            .setScale(0.5)

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('ArcherWalk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })

       
        const totalTasks = this.tasks.length
        const missed = this.tasks.filter(task => task.status === "incomplete").length
        const damagePerMissed = 3 / totalTasks
        const damage = missed * damagePerMissed
        this.health = Math.max(0, 3 - damage)

        this.add.sprite(30, 30, 'heart').setOrigin(0.5).setScale(0.07).setDepth(3)
        this.add.sprite(70, 30, 'heart').setOrigin(0.5).setScale(0.07).setDepth(3)
        this.add.sprite(110, 30, 'heart').setOrigin(0.5).setScale(0.07).setDepth(3)

        
        this.playStartAnimation()
    }

    update() {
        this.backgroundLayers?.forEach(({ layer, speed, isCloud }) => {
            if (layer.tilePositionX !== undefined) {
               
                if (isCloud) {
                    layer.tilePositionX += speed * 1.5 
                } else {
                    layer.tilePositionX += speed
                }
            }
        })
    }

    //utilizing the tasks or dayDuration create a background function that uses createBackground() to either create backgrounds per each task block or creates backgrounds based on dayDuration. include in this function a death scene, a start scene, victory scene, and failure scene using conditionals. 
        //if using tasks, map the tasks into levels and have each level be a different background. Then use the timeslot logic to create durations of each level.

    createBackground() {
        const themes = Object.keys(this.backgroundThemes)
        const selectedTheme = themes[Math.floor(Math.random() * themes.length)]
        const keys = this.backgroundThemes[selectedTheme].keys

        const { width, height } = this.scale
        this.backgroundLayers = []

        const scrollSpeeds = Array.from({ length: keys.length }, (_, i) => i * 0.2)
        const depthLevels = Array.from({ length: keys.length }, (_, i) => -keys.length + i)

        keys.forEach((key, index) => {
            let layer
            if (index === 0) {
                layer = this.add.image(0, 0, key)
                    .setOrigin(0)
                    .setDisplaySize(width, height)
                    .setDepth(depthLevels[index])
            } else {
                const imageHeight = this.textures.get(key).getSourceImage().height
                const yPos = height - imageHeight

                layer = this.add.tileSprite(0, yPos, width, imageHeight, key)
                    .setOrigin(0)
                    .setDepth(depthLevels[index])
            }

            this.backgroundLayers.push({
                layer,
                speed: scrollSpeeds[index] ?? 0,
                isCloud: index === 1 
            })
        })
    }

    playStartAnimation() {
        this.archer.play('walk')

        this.tweens.add({
            targets: this.archer,
            x: 150,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                this.startAutoTransitions()
            }
        })

    }

    startAutoTransitions() {
        const totalDuration = this.dayDuration * 60 * 1000; 

       
        const numTransitions = this.tasks.length > 0 ? this.tasks.length : 1;

    
        let transitionInterval = totalDuration / numTransitions;

     
        if (!transitionInterval || transitionInterval <= 0) {
            transitionInterval = 10000; 
        }

        this.transitionCount = 0;
        this.isTransitioning = false;

        this.time.addEvent({
            delay: transitionInterval,
            callback: () => {
                this.scrollInNewBackground();

                this.transitionCount++;
                if (this.transitionCount >= numTransitions) {
                    this.time.delayedCall(2000, () => {
                        this.playEndAnimation();
                    });
                }
            },
            callbackScope: this,
            loop: true
        });
    }


    

    scrollInNewBackground() {
        if (this.isTransitioning) return
        this.isTransitioning = true

        const { width, height } = this.scale
        const themes = Object.keys(this.backgroundThemes)
        const selectedTheme = themes[Math.floor(Math.random() * themes.length)]
        const keys = this.backgroundThemes[selectedTheme].keys

        const scrollSpeeds = Array.from({ length: keys.length }, (_, i) => i * 0.2)
        const depthLevels = Array.from({ length: keys.length }, (_, i) => -keys.length + i)

        const newLayers = []

        keys.forEach((key, index) => {
            let layer
            if (index === 0) {
                layer = this.add.image(width, 0, key)
                    .setOrigin(0)
                    .setDisplaySize(width, height)
                    .setDepth(depthLevels[index])
            } else {
                const imageHeight = this.textures.get(key).getSourceImage().height
                const yPos = height - imageHeight

                layer = this.add.tileSprite(width, yPos, width, imageHeight, key)
                    .setOrigin(0)
                    .setDepth(depthLevels[index])
            }

            newLayers.push({
                layer,
                speed: scrollSpeeds[index] ?? 0,
                isCloud: index === 1
            })
        })


        const transitionDuration = 12000

        this.tweens.addCounter({
            from: 0,
            to: width,
            duration: transitionDuration,
            ease: 'Linear',
            onUpdate: tween => {
                const value = tween.getValue()

                this.backgroundLayers.forEach(({ layer }) => {
                    layer.x = 0 - value
                })

                newLayers.forEach(({ layer }) => {
                    layer.x = width - value
                })
            },
            onComplete: () => {
                this.backgroundLayers.forEach(({ layer }) => layer.destroy())
                this.backgroundLayers = newLayers
                this.isTransitioning = false
            }
        })
    }

    playEndAnimation() {
        if (!this.archer || this.isTransitioning) return

        this.archer.play('walk')
        this.archer.flipX = false 

        this.tweens.add({
            targets: this.archer,
            x: this.scale.width + 100,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.scene.start('VictoryScene') 
                })
            }
        })
    }
}

// Your background sets
const BackgroundThemes = {
    nature2: {
        folder: 'nature_2',
        keys: ['nature2_1', 'nature2_2', 'nature2_3', 'nature2_4']
    },
    nature3: {
        folder: 'nature_3',
        keys: ['nature3_1', 'nature3_2', 'nature3_3', 'nature3_4']
    },
    nature4: {
        folder: 'nature_4',
        keys: ['nature4_1', 'nature4_2', 'nature4_3', 'nature4_4']
    },
    nature5: {
        folder: 'nature_5',
        keys: ['nature5_1', 'nature5_2', 'nature5_3', 'nature5_4']
    },
    winter4: {
        folder: "winter_4",
        keys: ['winter4_1', 'winter4_2', 'winter4_3', 'winter4_4']
    }
}

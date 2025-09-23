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
        this.hp = 10 * 100
        this.maxHp = this.tasks.length * 100
        }


    preload() {
        this.load.spritesheet('ArcherWalk', 'assets/heros/Archer/Walk.png', {
            frameWidth: 1024 / 8,
            frameHeight: 128
        })

        //this.load.image("heart", "assets/8.png")
        this.load.spritesheet("ArcherDeath", 'assets/heros/Archer/Dead.png',{
            frameWidth: 384/3,
            frameHeight: 128
        })

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
        this.anims.create({
            key: 'Death',
            frames:  this.anims.generateFrameNumbers("ArcherDeath", {start: 0, end: 2}),
            frameRate: 10,
            repeat: 0
        })

        console.log(this.tasks)
       
        const healthBar = this.add.graphics().setDepth(3);
        this.healthBar = healthBar
        this.playStartAnimation()
        this.createHealthBar()
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

    
    createHealthBar(){
        const width = 100
        const height = 20

        const barY = 20
        const barX = 20
        
        const missed = this.tasks.filter(task => task.status === "incomplete");
        const damage = missed.length * 100;
        const currentHp = Math.max(this.maxHp - damage, 0);
        const hpPercent = currentHp / this.maxHp;
       
        this.healthBar.clear();
        let color;
        if (hpPercent > 0.75) {
            color = 0x00ff00; 
        } else if (hpPercent > 0.5) {
            color = 0xffff00; 
        } else if (hpPercent > 0.25) {
            color = 0xffa500; 
        } else {
            color = 0xff0000;
            this.showDeathScreen() 
        }
        
        this.healthBar.fillStyle(color);
        this.healthBar.fillRect(barX, barY, width * hpPercent, height);

       
        this.healthBar.lineStyle(2, 0x000000);
        this.healthBar.strokeRect(barX, barY, width, height);
        console.log(this.maxHp)
        console.log(hpPercent)
    }

    showDeathScreen() {
        const { width, height } = this.sys.game.canvas;

        const background = this.add.rectangle(0, 0, width, height, 0x000000)
            .setOrigin(0)
            .setDepth(100);

        const endText = this.add.text(width / 2, height / 2 - 60, 'Quest Failed', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
        }).setOrigin(0.5).setDepth(101);

       
        const deathSprite = this.add.sprite(width / 2, height / 2 + 20, 'archerdeath')
            .setScale(2)
            .setDepth(101);

        
        deathSprite.play('archer_death');

        this.input.enabled = false;

       
        }


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

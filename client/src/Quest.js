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
{/*✅ Solution Strategy:
We'll scale the journey dynamically based on task count, but use modular + varied background zones to make it feel fresh.

✅ 1. Biome Pool (Diverse Zones)
Create a pool of unique biome backgrounds, e.g.:

js
Copy
Edit
const biomePool = [
  'plains',
  'desert',
  'forest',
  'mountain',
  'tundra',
  'swamp',
  'coast',
  'volcano'
];
✅ 2. Dynamic Biome Sequence Based on Tasks
When the game starts, pick a number of biomes based on task count, ensuring each biome covers a chunk of the journey.

Example:

js
Copy
Edit
const totalTasks = this.tasks.length;
const biomeCount = Math.min(totalTasks, biomePool.length); // e.g., 5 biomes for 5 tasks

const selectedBiomes = Phaser.Utils.Array.Shuffle(biomePool).slice(0, biomeCount);
Now your quest journey is tied to task count — more tasks = more biomes = longer quest.

✅ 3. Assign Distance Thresholds
Divide the total distance evenly per biome:

js
Copy
Edit
const distancePerBiome = 1000; // pixels per biome
this.biomes = selectedBiomes.map((key, index) => ({
  key,
  threshold: index * distancePerBiome
}));
✅ 4. Smooth Transition
Use the method from earlier to switch biomes once player crosses the threshold.

You can also fade out/in layers for a smoother transition if you'd like to avoid hard swaps.

✅ 5. Bonus: Add “Mini Events” Per Biome
For visual storytelling:

Add character animations

Show a flag/marker when a task is completed

Trigger ambient changes (fog, stars, rain, etc.)

This ties each biome to the user's sense of accomplishment.

🔄 What Happens with Fewer Tasks?
If there are only 3 tasks:

You’ll show 3 zones (e.g. plains → forest → tundra)

The distance feels shorter, but still dynamic

You could even slow down the scroll speed slightly, making the journey feel a bit more drawn out

🧩 Optional: Loopable "Filler" Biomes
For task counts over your unique biome list (say 25 tasks but only 8 biomes), you could:

Allow repeatable biomes, but remix them with different overlays (e.g., night plains, foggy forest)

Insert "rest zones" — small neutral areas (like a campfire scene) between big biomes

Would you like a starter function that generates the biome sequence with thresholds, based on task count?




Ask ChatGPT
 */}
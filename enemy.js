// MAP SIZE
const canvasWidth = 1200;
const canvasHeight = 700;

/** @module enemy */

/** The index of the builder is the ID of the enemy
 */
const ENEMY_BUILDERS = [
    (path, x, y) => new Tank(path, x, y),
    (path, x, y) => new Standard(path, x, y),
    (path, x, y) => new Rapid(path, x, y),
    (path, x, y) => new Spawner(path, x, y)
];

/** Class representing an enemy */

class Enemy {
    /**
     * Constructs an enemy based on speed, and the path it will follow
     * @param {number} speed - how quick an enemy moves along a path
     * @param {number} health - how much health an enemy has
     * @param {function} path - a path the enemy will be drawn on
     * @param {number} currency - how much money you will receive
     * @param {number} damage - how much health an enemy takes away
     * @param {number=} x - the starting x coordinate (if undefined, defaults to start of path's x)
     * @param {number=} y - the starting y coordinate (if undefined, defaults to start of path's y)
     */
    constructor(speed, health, path, currency, damage, x, y) {
        this.speed = speed;
        this.health = health;
        this.path = path;
        this.pathIndex = 0;
        this.x = x ?? 0;
        this.y = y ?? this.path(0);
        this.currency = currency;
        this.damage = damage;
    }

    draw() {
        // draw enemy
        push();
        
        this.drawAppearance();

        // health bar
        let healthbarwidth = 0;
        if (this.health > 30) { // max width
            healthbarwidth = 30 % this.health;
        } else {
            healthbarwidth = this.health;
        }
        fill(0, 200, 0);
        stroke(0, 180, 0);
        rectMode(CENTER);
        rect(this.x, this.y + 20, healthbarwidth, 5);
        //text(this.health, this.x-5, this.y - 20);
        
        this.x += this.speed;
        this.y = this.path(this.x);

        /*/ calculate distance to next point
        let dx = this.path[this.pathIndex + 1].x - this.x;
        let dy = this.path[this.pathIndex + 1].y - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        // if it cannot reach the next point in this frame
        if (distance > this.speed) {
            // normalize
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            this.x = this.path[this.pathIndex + 1].x;
            this.y = this.path[this.pathIndex + 1].y;
            this.pathIndex++;
        }
        pop(); */


    }
    
    /**
     * Method to check if enemy has reached the end of the path
     * @returns {boolean} boolean that if true, indicates the enemy is at the end of the path
     */
    hasReachedEnd() {
        return this.x >= canvasWidth;
    }
};
// ------------------------------------------ //
// ENEMY TYPE CLASSES
// ------------------------------------------ //

/** The Tank */
class Tank extends Enemy {
    constructor(path, x, y) {
        super(0.2, 25, path, 300, 6, x, y);
    }
    drawAppearance() {
        fill(10);
        noStroke();
        ellipse(this.x, this.y, 20, 20);
    }
}

/** The Standard */
class Standard extends Enemy {
    constructor(path, x, y) {
        super(0.5, 10, path, 140, 3, x, y);
    }
    drawAppearance() {
        fill(100);
        noStroke();
        square(this.x - 10, this.y - 10, 20);
    }
}

/** The Rapid */
class Rapid extends Enemy {
    constructor(path, x, y) {
        super(1, 5, path, 80, 1, x, y);
    }
    drawAppearance() {
        fill(50);
        noStroke();
        rect(this.x - 10, this.y - 10, 20, 20);
    }
}

/** The Spawner */
class Spawner extends Enemy {    
    constructor(path, x, y) {
        super(0.4, 5, path, 80, 1, x, y);
        
        this.spawnCount = 3;
        /**
         * 0 - spawn while alive
         * 1 - spawn upon death
        */
        this.spawnType = 1;
        this.spawnedEnemyId = 2;
        this.onCooldown = false;
        this.cooldownTime = 4000;
        if (!this.spawnType) {
            this.startCooldown();   
        }
    }
    drawAppearance() {
        fill(3000);
        noStroke();
        rect(this.x - 10, this.y - 10, 20, 20);
    }
    startCooldown() {
        this.onCooldown = true;
        setTimeout(() => {
            this.onCooldown = false;
        }, this.cooldownTime);
    }
    /**
     * @param {Array} enemies - the array of enemies to insert into
     */
    spawn(enemies) {
        const shouldSpawn = !this.spawnType || (this.spawnType && this.health <= 0);

        if (shouldSpawn) {
            for (let i = 0; i < this.spawnCount; ++i) {
                enemies.push(ENEMY_BUILDERS[this.spawnedEnemyId](this.path, this.x, this.y));
            }
            this.startCooldown();
        }
    }
}
    

/** @module wave */

/** Class representing a wave of enemies. This class stores the number of enemies of each type to spawn and the spawning priority for each type.  */
class Wave {
    /** Constructs a new Wave object
     *  @param {array} spawnData - integer array representing how many of each enemy type to spawn where array index = enemy type id 
     *  @param {array} spawnPriority - order to spawn enemy types in
     * @param {function} path - path spawned enemies travel along
     * @param {number} delay - amount of time in seconds to wait between spawning enemies 
     */
    constructor(spawnData, spawnPriority, path, delay) {
        this.spawnData = spawnData;
        this.spawnPriority = spawnPriority;
        this.path = path;
        this.delay = delay; 
        this.enemies = []; 
    }

    /** Prints wave spawnData and spawnPriority
     */
    debugPrintWave() {
        console.log("[DEBUG] New wave!");
        
        for (let i = 0; i < this.spawnData.length; i++) {
            console.log(i, ", spawnData: ", this.spawnData[i], "spawnPriority: ", this.spawnPriority[i]);
        }
    }

    spawnLoopHelper(i, j, k) {
        setTimeout(() => {
            var newEnemy = ENEMY_BUILDERS[k](this.path);
            this.spawnData[k]--;
            this.enemies.push(newEnemy);
            console.log("Spawned new enemy at ", this.delay * 1000 * i);
        }, this.delay * 1000 * (i + j)); 
    }

    /** Spawns all of the enemies in the wave 
     */
    spawn() {
        for (let i = 0; i < this.spawnPriority.length; i++)
        {
            let k = this.spawnPriority[i];
            let max = this.spawnData[k];
            if (max > 0) {
                for (let j = 0; j < max; j++) {
                    {
                        this.spawnLoopHelper(i, j, k); 
                    }
                }
            }
        }
    }

    /** Returns a stored list of enemies; used by towers for targeting
     */
    getEnemies() {
        return this.enemies;
    }
};

// ADD TO EXPORT LIST WHEN CREATE NEW ENEMY TYPE.
export { Enemy, Tank, Standard, Rapid, Wave }

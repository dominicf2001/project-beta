// MAP SIZE
const canvasWidth = 1200;
const canvasHeight = 700;

import { ENEMIES, MAPS } from "./config.js";
import { mapID } from "./index.js"

// Generate offset within the bounds of the path
function getOffset() {
    let width = Math.floor(MAPS[0].bottomPath(0) - MAPS[0].topPath(0));
    return Math.floor(Math.random() * width / 3) - Math.floor(width / 6);
}

/** @module enemy */

/** The index of the builder is the ID of the enemy
 */
const ENEMY_BUILDERS = [
    (path, offset, x, y) => new Tank(path, offset, x, y),
    (path, offset, x, y) => new Standard(path, offset, x, y),
    (path, offset, x, y) => new Rapid(path, offset, x, y),
    (path, offset, x, y) => new Spawner(path, offset, x, y),
    (path, offset, x, y) => new Stunner(path, offset, x, y)
];

/** Class representing an enemy */

class Enemy {
    /**
     * Constructs an enemy based on speed, and the path it will follow
     * @param {string} appearance - the appearance of the enemy
     * @param {number} speed - how quick an enemy moves along a path
     * @param {number} health - how much health an enemy has
     * @param {function} path - a path the enemy will be drawn on
     * @param {number=} offset - how much enemy sways from the path, will never go off bounds
     * @param {number} currency - how much money you will receive
     * @param {number} damage - how much health an enemy takes away
     * @param {number} damageDistance - how far away an enemy can damage a tower
     * @param {number=} x - the starting x coordinate (if undefined, defaults to start of path's x)
     * @param {number=} y - the starting y coordinate (if undefined, defaults to start of path's y)
     * @param {boolean} unFreeze - the x coordinate where the enemy stop being frozen
     * @param {boolean} unPoison - the x coordinate where the enemy stop being poisoned
     */
    constructor(appearance, speed, health, path, offset, currency, damage, damageDistance, x, y) {
        this.appearance = appearance;
        this.speed = speed;
        this.health = health;
        this.path = path;
        this.offset = offset ?? 0;
        this.pathIndex = 0;
        this.currency = currency;
        this.damage = damage;
        this.damageDistance = damageDistance ?? 0;
        this.coolDown = 0;
        this.unFreeze = -1;
        this.unPoison = -1;
        this.dead = false; 
        this.mapID = mapID;
        this.x = x ?? 0;
        this.y = y ?? this.path(0) + this.offset;
        this.theta = 4*Math.PI;
    }

    draw(sprite) {
        console.log(this.mapID);
        // draw enemy
        push();
        image(sprite, this.x, this.y, 60, 60);

        // health bar
        let healthBarWidth = 0;
        if (this.health > 30) { // max width
            healthBarWidth = 30 % this.health;
        } else {
            healthBarWidth = this.health;
        }
        fill(0, 200, 0);
        stroke(0, 180, 0);
        rectMode(CENTER);
        rect(this.x, this.y + 40, healthBarWidth, 5);

        if (this.mapID == 2) {
            if (this.x < 223) {
                this.x += this.speed;
                this.y = this.path(this.x) + this.offset;
            } else {
                let t = this.speed / 100;
                let obj = this.path(this.x, this.theta);
                this.x = 584 + obj.x;
                this.y = 348 + obj.y;
                console.log(obj);
                console.log(this.theta);
                this.theta -= t;
            }
        } else {
            this.x += this.speed;
            this.y = this.path(this.x) + this.offset;
        }
        pop();

    }

    drawBasic() {
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

        this.y = this.path(this.x) + this.offset;
        pop();

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
        if (mapID != 2) return this.x >= canvasWidth;
        else return this.theta <= 0;
    }
    
    damageTowers(towers) {
        for(let i = 0; i < towers.length; i++) {
            let tower = towers[i];
            let distance = dist(this.x, this.y, tower.x, tower.y);
            if (distance < this.damageDistance && this.coolDown <= 0) {
                tower.health -= this.damage;
                this.coolDown = 5;
            } else {
                this.coolDown--;
            }
        }
    }

    checkStatus() {
        if (this.unFreeze != -1 && this.x >= this.unFreeze) {
            this.speed *= 2;
            this.unFreeze = -1;
        }
        if (this.unPoison != -1) {
            if (this.x < this.unPoison) this.health = this.health - 0.05;
            else this.unPoison = -1;
        }
    }
    isDead() {
        return this.dead; 
    }

    kill() {
        console.log("Enemy down!!");
        this.dead = true; 
    }
};
// ------------------------------------------ //
// ENEMY TYPE CLASSES
// ------------------------------------------ //

/** The Tank */
class Tank extends Enemy {
    constructor(path, offset, x, y, mapID) {
        const e = ENEMIES[0];
        // TODO: take in the entire object instead?
        super(e.APPEARANCE, e.SPEED, e.HEALTH, path, offset, e.CURRENCY, e.DAMAGE, e.DAMAGE_DISTANCE, x, y);
    }
    drawAppearance() {
        fill(10);
        noStroke();
        ellipse(this.x, this.y, 20, 20);
    }
}

/** The Standard */
class Standard extends Enemy {
    constructor(path, offset, x, y, mapID) {
        const e = ENEMIES[1];
        super(e.APPEARANCE, e.SPEED, e.HEALTH, path, offset, e.CURRENCY, e.DAMAGE, e.DAMAGE_DISTANCE, x, y);
    }
    drawAppearance() {
        fill(100);
        noStroke();
        square(this.x - 10, this.y - 10, 20);
    }
}

/** The Rapid */
class Rapid extends Enemy {
    constructor(path, offset, x, y, mapID) {
        const e = ENEMIES[2];
        super(e.APPEARANCE, e.SPEED, e.HEALTH, path, offset, e.CURRENCY, e.DAMAGE, e.DAMAGE_DISTANCE, x, y);
    }
    drawAppearance() {
        fill(50);
        noStroke();
        rect(this.x - 10, this.y - 10, 20, 20);
    }
}

/** The Spawner */
class Spawner extends Enemy {    
    constructor(path, offset, x, y, mapID) {
        const e = ENEMIES[3];
        super(e.APPEARANCE, e.SPEED, e.HEALTH, path, offset, e.CURRENCY, e.DAMAGE, e.DAMAGE_DISTANCE, x, y);
        
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
    spawn(enemies, nextWaveCheck) {
        const shouldSpawn = !this.spawnType || (this.spawnType && this.health <= 0);

        if (shouldSpawn) {
            nextWaveCheck.amount += this.spawnCount;
            for (let i = 0; i < this.spawnCount; ++i) {
                enemies.push(ENEMY_BUILDERS[this.spawnedEnemyId](this.path, getOffset(), this.x, this.y));
            }
            this.startCooldown();
        }
    }
}

/** The Stunner */
class Stunner extends Enemy {
    constructor(path, offset, x, y, mapID) {
        const e = ENEMIES[4];
        super(e.APPEARANCE, e.SPEED, e.HEALTH, path, offset, e.CURRENCY, e.DAMAGE, e.DAMAGE_DISTANCE, x, y);
    }
    drawAppearance() {
        fill(75);
        noStroke();
        triangle(this.x - 10, this.y + 10, this.x, this.y - 10, this.x + 10, this.y + 10);
    }

    // Returns the index of the tower that will be stunned.
    // Generated at random from 0 to n (number of towers)
    stunTower(n) {
        if (n > 0) {
            // let r = n % 3;
            // let q = Math.floor(n / 3);
            return Math.floor(Math.random() * n);
        } else return -1;
    }
}
    

/** @module wave */

/** Class representing a wave of enemies. This class stores the number of enemies of each type to spawn and the spawning priority for each type.  */
class Wave {
    /** Constructs a new Wave object
     * @param {array} spawnData - integer array representing how many of each enemy type to spawn where array index = enemy type id 
     * @param {array} spawnPriority - order to spawn enemy types in
     * @param {function} path - path spawned enemies travel along
     * @param {number} delay - amount of time in seconds to wait between spawning enemies 
     */
    constructor(spawnData, spawnPriority, path, delay) {
        this.spawnData = spawnData;
        this.spawnPriority = spawnPriority;
        this.path = path;
        this.delay = delay; 
        this.enemies = []; 
        this.waveAmount = [0, 0, 0, 0, 0]; // Counts how many times which enemy types are called.
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
            var newEnemy = ENEMY_BUILDERS[k](this.path, getOffset());
            this.spawnData[k]--;
            this.enemies.push(newEnemy);
            console.log("Spawned new enemy at ", this.delay * 1000 * i);
        }, this.delay * 600 * (i + j)); 
    }

    /** Spawns all of the enemies in the wave 
     */
    spawn() {
        for (let i = 0; i < this.spawnPriority.length; i++)
        {
            let k = this.spawnPriority[i];
            let max = this.spawnData[k][this.waveAmount[k]];
            console.log(max);
            if (max > 0) {
                this.waveAmount[k]++;
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
export { Enemy, Tank, Standard, Rapid, Wave, Stunner, Spawner }

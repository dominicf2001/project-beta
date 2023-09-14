/** @module enemy */

/** Class representing an enemy */
export class Enemy {
    /**
     * Constructs an enemy based on speed, and the path it will follow
     * @param {number} type - integer id of enemy type 
     * @param {number} speed - how quick an enemy moves along a path
     * @param {array} path - a path the enemy will be drawn on
     */
    constructor(type, speed, health, path) {
        this.type = type; 
        this.speed = speed;
        this.health = health;
        this.path = path;
        this.pathIndex = 0;
        this.x = path[0].x;
        this.y = path[0].y;
    }
    draw() {
        // draw enemy
        // note: should eventually depend on the enemy type
        push();
        fill(50);
        noStroke();
        ellipse(this.x, this.y, 20, 20);

        // calculate distance to next point
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
        pop();
    }
    /**
     * Method to check if enemy has reached the end of the path
     * @returns {boolean} boolean that if true, indicates the enemy is at the end of the path
     */
    hasReachedEnd() {
        return this.pathIndex === this.path.length - 1;
    }
};


/** @module wave */

/** Class representing a wave of enemies. This class stores the number of enemies of each type to spawn and the spawning priority for each type.  */
export class Wave {
    /** Constructs a new Wave object
     *  @param {array} spawnData - integer array representing how many of each enemy type to spawn where array index = enemy type id 
     *  @param {array} spawnPriority - order to spawn enemy types in
     * @param {array} path - path spawned enemies travel along
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
            var newEnemy = new Enemy(k, k / 2, k, this.path);
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

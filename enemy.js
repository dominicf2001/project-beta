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
        this.x = this.path[0].x;
        this.y = this.path[0].y;
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
     * @param{array} path - path spawned enemies travel along
     */
    constructor(spawnData, spawnPriority, path) {
        this.spawnData = spawnData;
        this.spawnPriority = spawnPriority;
        this.path = path;
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

    /** Spawns all of the enemies in the wave 
     */
    spawn() {
        for (let i = 0; i < this.spawnData.length; i++) {
             if(this.spawnData[i] > 0) {
                var newEnemy = new Enemy(i, i, i, this.path);
                this.spawnData[i]--;
                this.enemies.push(newEnemy);
            }
        }
    }
    
    /** Returns a stored list of enemies; used by towers for targeting
     */
    getEnemies() {
        return this.enemies;
    }
};

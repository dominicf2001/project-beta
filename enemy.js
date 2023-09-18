/** @module enemy */

/** Class representing an enemy */
class Enemy {
    /**
     * Constructs an enemy based on speed, and the path it will follow
     * @param {number} speed - how quick an enemy moves along a path
     * @param {array} path - a path the enemy will be drawn on
     * @param {number} currency - how much money you will receive
     * @param {number} damage - how much health an enemy takes away
     */
    constructor(speed, health, path, currency, damage) {
        this.speed = speed;
        this.health = health;
        this.path = path;
        this.pathIndex = 0;
        this.x = this.path[0].x;
        this.y = this.path[0].y;
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

// ------------------------------------------ //
// ENEMY TYPE CLASSES
// ------------------------------------------ //

/** The Tank */
class Tank extends Enemy {
    constructor(path) {
        super(0.05, 25, path, 300, 6);
    }
    drawAppearance() {
        fill(10);
        noStroke();
        ellipse(this.x, this.y, 20, 20);
    }
}

/** The Standard */
class Standard extends Enemy {
    constructor(path) {
        super(0.1, 10, path, 140, 3);
    }
    drawAppearance() {
        fill(100);
        noStroke();
        square(this.x - 10, this.y - 10, 20);
    }
}

/** The Rapid */
class Rapid extends Enemy {
    constructor(path) {
        super(0.3, 5, path, 80, 1);
    }
    drawAppearance() {
        fill(50);
        noStroke();
        rect(this.x - 10, this.y - 10, 20, 20);
    }
}

// ADD TO EXPORT LIST WHEN CREATE NEW ENEMY TYPE.
export { Enemy, Tank, Standard, Rapid }

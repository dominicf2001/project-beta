/** @module enemy */

/** Class representing an enemy */
export default class Enemy {
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
        // note: should eventually depend on the enemy type
        push();
        fill(50);
        noStroke();
        ellipse(this.x, this.y, 20, 20);

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

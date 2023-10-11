
/** @module tower */

var spriteSheet;
var towerAnimation;

export class Tower {
    static TOWER_SIZE = 90;
    
    /**
     * Constructs a tower with x and y coordinates
     * @param {number} x - x coordinate of tower
     * @param {number} y - y coordinate of tower
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.damage = 1;
        this.health = 30;
        this.fireRate = 1;
        this.coolDown = 5;
        this.hover = false;
        this.stunAmmount = 0;
    }
    
    /**
     * Method to draw the tower on the canvas
     * @returns {void} draws the tower on the canvas, and a circle around it if the mouse is hovering over it
     */
    draw(towerSprite) {
        
        push();

        // Draw tower
        image(towerSprite, this.x, this.y, Tower.TOWER_SIZE, Tower.TOWER_SIZE);

        strokeWeight(2);
        stroke(255);
        noFill();
        if(this.hover) {
            circle(this.x, this.y, this.range * 2);
        }
        noStroke();
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
        rect(this.x, this.y + 60, healthBarWidth, 5);
        console.log(this.stunAmmount);
        pop();
    }
    
    /**
     * Method to draw a stunned tower on the canvas
     * @returns {void} draws the tower on the canvas, but in a stunned state
     */

    drawStunned() {
        
        push();

        // draw stunned box (triangle for now)
        fill(255);
        noStroke();
        triangle(this.x - 15, this.y + 15, this.x, this.y - 15, this.x + 15, this.y + 15);

        pop();
    }

    /**
     * Method to check if mouse is inside the tower
     * @returns {boolean} boolean that if true, indicates the mouse is inside the tower
     */
    mouseInside() {
        return mouseX > this.x - (Tower.TOWER_SIZE / 2) && mouseX < this.x + (Tower.TOWER_SIZE / 2) && mouseY > this.y - (Tower.TOWER_SIZE / 2) && mouseY < this.y + (Tower.TOWER_SIZE / 2);
    }

    /**
     * Method to check if the tower can fire a bullet
     * @returns {boolean} boolean that if true, indicates the tower can fire a bullet
     */
    canFire() {
        if (this.stunAmmount > 0) return false;
        if (this.coolDown > this.fireRate) {
            this.coolDown--;
            return false;
        } else {
            return true;
        }
    }

    /**
     * Method to fire a bullet
     * @param {Enemy} enemy - enemy that the bullet is targeting
     * @returns {Bullet} bullet fired by the tower
     */
    fire(enemy) {
        this.coolDown = 5;
        return new Bullet(this, enemy); 
    }

    /**
     * Method to upgrade the tower's firing range
     * @returns {void} upgrades the tower's firing range
     */
    upgradeRange() {
        this.range += 10;
    }

    /**
     * Method to upgrade the tower's firing rate
     * @returns {void} upgrades the tower's firing rate
     */
    upgradeFireRate() {
        this.fireRate += 1;
    }

    /**
     * Method to stun the tower
     * @returns {void} stun the tower by making it needed to be clicked 7 times
     */
    stun() {
        // this.fireRate = 0;
        this.stunAmmount = 5;
    }
    
    /**
     * Method to "unstun" the tower by clicking on it
     * @returns {void} reduce the amount of clicks needed by 1
     * PREREQUISITE: this.isStunned() == true
     */
    reduceStun(st) {
        this.stunAmmount--;
        if (this.stunAmmount == 0) st.amount = 0;
    }

    /**
     * Method to check if tower is stunned
     * @returns {boolean} true if tower is stunned, false otherwise
     */
    isStunned() {
        return (this.stunAmmount > 0);
    }
};

export class Bullet {

    /**
     * Constructs a bullet with a tower and target
     * @param {Tower} tower - tower that fired the bullet
     * @param {Enemy} target - enemy that the bullet is targeting
     */
    constructor(tower, target) {
        this.x = tower.x;
        this.y = tower.y;
        this.range = tower.range;
        this.damage = tower.damage;
        this.target = target;
        
        this.updateDirection();
    }

    /**
     * Method to draw the bullet on the canvas
     * @returns {void} draws the bullet on the canvas
     * @modifies {x} - x coordinate of bullet
     * @modifies {y} - y coordinate of bullet
     * @modifies {range} - range of bullet
     */
    draw() {
        push();
        strokeWeight(2);
        fill(255, 0, 0);
        ellipse(this.x, this.y, 5, 5);
        this.x += this.xMove * 2;
        this.y += this.yMove * 2;
        this.range--;
        pop();

        // update only every 15 frames to ease computation
        if (this.range % 15 === 0){
            this.updateDirection();   
        }
    }

    /**
     * Method to check if bullet is out of range
     * @returns {boolean} boolean that if true, indicates the bullet is out of range
     */
    isOutOfRange() {
        return this.range <= 0;
    }

    /**     * Method to check if bullet has hit its target
     * @returns {boolean} boolean that if true, indicates the bullet has hit its target
     */
    hasHitTarget() {
        const dx = this.x - this.target.x;
        const dy = this.y - this.target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= 8;
    }

    updateDirection() {
        const xDist = this.target.x - this.x;
        const yDist = this.target.y - this.y;
        
        this.angle = Math.atan2(yDist, xDist);
        this.xMove = Math.cos(this.angle);
        this.yMove = Math.sin(this.angle);
    }
}
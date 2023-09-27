
/** @module tower */

var spriteSheet;
var towerAnimation;

export class Tower {
    static TOWER_SIZE = 40;
    
    /**
     * Constructs a tower with x and y coordinates
     * @param {number} x - x coordinate of tower
     * @param {number} y - y coordinate of tower
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 50;
        this.damage = 1;
        this.fireRate = 1;
        this.coolDown = 5;
        this.hover = false;
    }
    
    /**
     * Method to draw the tower on the canvas
     * @returns {void} draws the tower on the canvas, and a circle around it if the mouse is hovering over it
     */
    draw(towerSprite) {
        
        push();
        fill(152, 84, 235);

        //tower as a rectangle
        rect(this.x - (Tower.TOWER_SIZE / 4), this.y - (Tower.TOWER_SIZE / 2), Tower.TOWER_SIZE/2, Tower.TOWER_SIZE, 10, 10, 0, 0);
        
        //tower as a sprite (DOESNT WORK)
        //image(towerSprite, this.x - (Tower.TOWER_SIZE / 2), this.y - (Tower.TOWER_SIZE / 2), Tower.TOWER_SIZE, Tower.TOWER_SIZE);
        //img = loadImage('assets/RedMoonTower.png');
        //image(img, 0, 0);

        strokeWeight(2);
        stroke(255);
        noFill();
        if(this.hover) {
            circle(this.x, this.y, this.range * 2);
        }
        noStroke();
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
        
        let xDist = target.x - tower.x;
        let yDist = target.y - tower.y;
        this.angle = atan2(yDist, xDist);

        this.xMove = Math.cos(this.angle);
        this.yMove = Math.sin(this.angle);
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
        this.x += this.xMove;
        this.y += this.yMove;
        this.range--;
        pop();
    }

    /**
     * Method to check if bullet is out of range
     * @returns {boolean} boolean that if true, indicates the bullet is out of range
     */
    isOutOfRange() {
        return this.range <= 0;
    }

    /**
     * Method to check if bullet has hit its target
     * @returns {boolean} boolean that if true, indicates the bullet has hit its target
     */
    hasHitTarget() {
        const dx = this.x - this.target.x;
        const dy = this.y - this.target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= 8;
    }
}

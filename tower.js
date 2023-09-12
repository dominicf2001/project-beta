var spriteSheet;
var towerAnimation;


export class Tower {
    static TOWER_SIZE = 20;
    

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 50;
        this.damage = 1;
        this.fireRate = 1;
        this.hover = false;
    }
    
    draw() {
        push();
        fill(152, 84, 235);
        rect(this.x - (Tower.TOWER_SIZE / 2), this.y - (Tower.TOWER_SIZE / 2), Tower.TOWER_SIZE, Tower.TOWER_SIZE);

        strokeWeight(2);
        stroke(255);
        noFill();
        if(this.hover) {
            circle(this.x, this.y, this.range * 2);
        }
        noStroke();
        pop();
    }

    mouseInside() {
        return mouseX > this.x - (Tower.TOWER_SIZE / 2) && mouseX < this.x + (Tower.TOWER_SIZE / 2) && mouseY > this.y - (Tower.TOWER_SIZE / 2) && mouseY < this.y + (Tower.TOWER_SIZE / 2);
    }
};

export class Bullet {
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
    isOutOfRange() {
        return this.range <= 0;
    }
    hasHitTarget() {
        const dx = this.x - this.target.x;
        const dy = this.y - this.target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= 8;
    }
}

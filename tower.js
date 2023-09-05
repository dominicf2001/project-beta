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
        fill(152, 84, 235);
        rect(this.x - (Tower.TOWER_SIZE / 2), this.y - (Tower.TOWER_SIZE / 2), Tower.TOWER_SIZE, Tower.TOWER_SIZE);

        strokeWeight(2);
        stroke(255);
        noFill();
        if(this.hover) {
            circle(this.x, this.y, this.range * 2);
        }
        noStroke();
    }

    mouseInside() {
        return mouseX > this.x - (Tower.TOWER_SIZE / 2) && mouseX < this.x + (Tower.TOWER_SIZE / 2) && mouseY > this.y - (Tower.TOWER_SIZE / 2) && mouseY < this.y + (Tower.TOWER_SIZE / 2);
    }
};

export class Bullet {
    constructor(tower) {
        this.x = tower.x;
        this.y = tower.y;
        this.range = tower.range;

        // Generate random angle, and calculate x and y movement
        this.angle = Math.random()*Math.PI*2;
        this.xMove = Math.cos(this.angle);
        this.yMove = Math.sin(this.angle);
    }

    draw() {
        strokeWeight(2);
        fill(255, 0, 0);
        ellipse(this.x, this.y, 5, 5);
        this.x += this.xMove;
        this.y += this.yMove;
        this.range--;
    }
    isOutOfRange() {
        return this.range <= 0;
    }
}

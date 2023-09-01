const TOWER_SIZE = 20;

let towerLimit = 5;
let towers = [];
let bullets = [];

class Tower {
    constructor(x, y) {
        if (towerLimit <= 0) {
            throw new Error("No more towers allowed!");
        }
        this.x = x;
        this.y = y;
        this.range = 50;
        this.damage = 1;
        this.fireRate = 1;
        towerLimit--;
    }

    draw() {
        fill(152, 84, 235);
        rect(this.x - (TOWER_SIZE / 2), this.y - (TOWER_SIZE / 2), TOWER_SIZE, TOWER_SIZE);

        stroke(255);
        noFill();
        circle(this.x, this.y, this.range * 2)
        noStroke();
    }
};

class Bullet {
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
        fill(255, 0, 0);
        ellipse(this.x, this.y, 5, 5);
        this.x += this.xMove;
        this.y += this.yMove;
        this.range--;

        // Remove bullet if it's out of range
        if (this.range <= 0) {
            bullets.splice(bullets.indexOf(this), 1);
        }
    }
}

function setup() {
    createCanvas(400, 400);

    // Fire bullets every 400ms
    setInterval(fireBullets, 400);
}

function fireBullets() {
    // Generate bullets for each tower
    for(let t of towers) {
        bullets.push(new Bullet(t));
    }
}

function draw() {
    background(0);

    // Draw bullets first, so they appear behind towers
    for (let b of bullets) {
        b.draw();
    }

    // Draw towers
    for(let t of towers) {
        t.draw();
    }
}

function mousePressed(event) {
    console.log(event);
    // Ignore touch events, only handle left mouse button
    if (event.button === 0) {
        try {
            let t = new Tower(mouseX, mouseY);
            towers.push(t);
            bullets.push(new Bullet(t));
        } catch (e) {
            alert(e);
        }
    }
}
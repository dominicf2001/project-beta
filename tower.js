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
        this.hover = false;
        towerLimit--;
    }

    draw() {
        fill(152, 84, 235);
        rect(this.x - (TOWER_SIZE / 2), this.y - (TOWER_SIZE / 2), TOWER_SIZE, TOWER_SIZE);

        stroke(255);
        noFill();
        if(this.hover) {
            circle(this.x, this.y, this.range * 2);
        }
        noStroke();
    }

    mouseInside() {
        return mouseX > this.x - (TOWER_SIZE / 2) && mouseX < this.x + (TOWER_SIZE / 2) && mouseY > this.y - (TOWER_SIZE / 2) && mouseY < this.y + (TOWER_SIZE / 2);
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

let dragTower = null;

function mousePressed(event) {
    console.log(event);

    // Check if mouse is inside a tower
    for(let t = 0; t < towers.length; t++) {
        if (towers[t].mouseInside()) {
            dragTower = towers.splice(t, 1)[0];
            dragTower.hover = true;
            towers.push(dragTower);
            break;
        }
    }

    //Ignore touch events, only handle left mouse button
    if (event.button === 0 && !dragTower) {
        try {
            let t = new Tower(mouseX, mouseY);
            towers.push(t);
            bullets.push(new Bullet(t));
        } catch (e) {
            alert(e);
        }
    }
}

function mouseDragged() {
    // Move tower if it's being dragged
    if(dragTower) {
        dragTower.x = mouseX;
        dragTower.y = mouseY;
    }
}

function mouseReleased() {
    // Stop dragging tower
    if (dragTower) {
        dragTower.x = mouseX;
        dragTower.y = mouseY;
        dragTower.hover = false;
        dragTower = null;
    }
}

function mouseMoved() {
    // Change cursor if mouse is inside a tower
    for(let t of towers) {
        if (t.mouseInside()) {
            t.hover = true;
            cursor('grab');
            return;
        }
    }
    for(let t of towers) {
        t.hover = false;
    }
    cursor();
}
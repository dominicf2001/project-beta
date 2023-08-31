const path = [
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    { x: 150, y: 150 },
    { x: 250, y: 150 },
    { x: 250, y: 250 },
];

    
class Enemy {
    constructor(speed, id) {
        this.speed = speed;
        this.x = path[0].x,
            this.y = path[0].y,
            this.pathIndex = 0,
            this.id = id
    }

    draw() {
        // draw enemy
        // note: should eventually depend on the enemy type
        fill(50);
        noStroke();
        ellipse(this.x, this.y, 20, 20);

        // calculate distance to next point
        let dx = path[this.pathIndex + 1].x - this.x;
        let dy = path[this.pathIndex + 1].y - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        // if it cannot reach the next point in this frame
        if (distance > this.speed) {
            // normalize
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            this.x = path[this.pathIndex + 1].x;
            this.y = path[this.pathIndex + 1].y;
            this.pathIndex++;

            // delete this enemy
            if (this.pathIndex === path.length - 1) {
                enemies.splice(this.id, 1);
            }
        }
    }
};

const enemies = [
    new Enemy(2, 0),
    new Enemy(3, 1)
];

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(0);

    // draw path
    strokeWeight(20);
    stroke(255);
    noFill();
    beginShape();
    for (let point of path) {
        vertex(point.x, point.y);
    }
    endShape();
    
    // draw enemies
    for (const enemy of enemies) {
        enemy.draw();
    }
    
}

import Enemy from "./enemy.js";

const path = [
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    { x: 150, y: 150 },
    { x: 250, y: 150 },
    { x: 250, y: 250 },
];

const enemies = [
    new Enemy(2, path),
    new Enemy(3, path)
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
    for (const point of path) {
        vertex(point.x, point.y);
    }
    endShape();
    
    // draw or remove enemies
    for (const i in enemies) {
        if (enemies[i].hasReachedEnd()) {
            enemies.splice(i, 1);
        } else {1
            enemies[i].draw();   
        }
    }
    
}

// In order to use ES6 modules, these functions need to be set on the window object.
// This is due to p5 not being able to directly see into modules
window.setup = setup;
window.draw = draw;

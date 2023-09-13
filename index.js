import { Enemy, Wave } from "./enemy.js";
import { Tower, Bullet }  from "./tower.js";

// GLOBAL VARIABLES

const path = [
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    { x: 150, y: 150 },
    { x: 250, y: 150 },
    { x: 250, y: 250 },
];

const enemies = [
    new Enemy(0.2, 10, path),
    new Enemy(0.3, 5, path)
];

// tower variables
const towerLimit = 5;
const towers = [];
const bullets = [];
let dragTower = null;

// EVENT LISTENERS

window.mousePressed = function(event) {
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
            if (towers.length > towerLimit) {
                throw new Error("No more towers allowed!");
            }
            let t = new Tower(mouseX, mouseY);
            towers.push(t);
        } catch (e) {
            alert(e);
        }
    }
}

window.mouseDragged = function() {
    // Move tower if it's being dragged
    if(dragTower) {
        dragTower.x = mouseX;
        dragTower.y = mouseY;
    }
}

window.mouseReleased = function() {
    // Stop dragging tower
    if (dragTower) {
        dragTower.x = mouseX;
        dragTower.y = mouseY;
        dragTower.hover = false;
        dragTower = null;
    }
}

window.mouseMoved = function() {
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

// HELPERS

function fireBullets() {
    // Generate bullets for each tower
    for(let t of towers) {
        let shortestDistance = Infinity;
        let closestEnemy = null;

        for(let e of enemies) {
            let xDist = e.x - t.x;
            let yDist = e.y - t.y;
            let distance = sqrt(xDist * xDist + yDist * yDist);

            if(distance < t.range && distance < shortestDistance) {
                shortestDistance = distance;
                closestEnemy = e;
            }
        }

        if(closestEnemy !== null) {
            bullets.push(new Bullet(t, closestEnemy));
        }
    }
}


// GAME LOOP

window.setup = function() {
    createCanvas(400, 400);

    // Fire bullets every 400mps
    setInterval(fireBullets, 400);
}

window.draw = function() {
    background(200);
    
    // draw path
    push();
    strokeWeight(20);
    stroke(255);
    noFill();
    beginShape();
    for (const point of path) {
        vertex(point.x, point.y);
    }
    endShape();
    pop();
    
    // draw or remove enemies
    for (const i in enemies) {
        if (enemies[i].hasReachedEnd() || !enemies[i].health) {
            enemies.splice(i, 1);
        } else {
            enemies[i].draw();
        }
    }

    // Draw bullets before towers
    for (const i in bullets) {
        if (bullets[i].isOutOfRange()) {
            bullets.splice(i, 1);
            continue;
        }
        
        if (bullets[i].hasHitTarget()) {
            console.log("HIT");
            console.log("ENEMY HP: ", bullets[i].target.health);
            console.log("Damage: ", bullets[i].damage);
            console.log("ENEMY HP: ", bullets[i].target.health);
            bullets[i].target.health -= bullets[i].damage;
            bullets.splice(i, 1);
        } else {
            bullets[i].draw();
        }
    }

    // Draw towers
    for (const t of towers) {
        t.draw();
    }
    
}


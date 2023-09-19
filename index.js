import { Tank, Standard, Rapid, Wave } from "./enemy.js";
import { Tower, Bullet }  from "./tower.js";


// GLOBAL VARIABLES
let img;

// 0 - main menu
// 1 - start game
var gameMode = 0;
let f_Andale;

const path = [
    { x: 0, y: 380 },
    { x: 1190, y: 380 },
];

const test_waveData = [0, 0, 0, 1];
const test_spawnPriority = [3];

const newWave = new Wave(test_waveData, test_spawnPriority, path, 4);

newWave.debugPrintWave();
newWave.spawn();
const enemies = newWave.getEnemies();

// tower variables
const towerLimit = 5;
const towers = [];
const bullets = [];
let dragTower = null;
let playSound = false;

// other relevant variables
let totalCurrency = 0;
let totalHealth = 50;
let encyclopedia;

// EVENT LISTENERS

window.mousePressed = function(event) {
    if (gameMode == 1) {
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
}

window.mouseDragged = function() {
    // Move tower if it's being dragged
    if(dragTower != null) {
        dragTower.x = mouseX;
        dragTower.y = mouseY;
    }
}

window.mouseReleased = function() {
    // Stop dragging tower
    if (dragTower != null) {
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

window.keyPressed = function() {
    if (keyCode === ENTER) {
        gameMode = 1;
    }
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


let mySound;

window.preload = function(){
    mySound = loadSound('./assets/potassium.mp3');
    f_Andale = loadFont('./assets/Andale-Mono.ttf');
    img = loadImage('Maps/Tower Defense Map Ideas.png'); // Loads the Map
}

window.setup = function() {
    createCanvas(1507, 737);
    // Fire bullets every 400mps
    setInterval(fireBullets, 400);
}

window.draw = function() {
    if (gameMode == 0) {
        mainMenu();
    }
    if (gameMode == 1) {
        background(200);

        if (!playSound) {
            mySound.setVolume(0.3);
            mySound.play();
            playSound = true;
        }

        image(img, 0, 0, 1200, 650);
        // Draw bullets first, so they appear behind towers
        for (const i in bullets) {
            if (bullets[i].isOutOfRange()) {
                bullets.splice(i, 1);
            } else {
                bullets[i].draw();   
            }
        }

        // Draw towers
        for (const t of towers) {
            t.draw();
        }
        // draw path
    
        push();
        strokeWeight(20);
        stroke(0, 0, 0, 0);
        noFill();
        beginShape();
        for (const point of path) {
            vertex(point.x, point.y);
        }
        endShape();
        pop();

        // draw currency holder
        push();
        textSize(20);
        text(totalCurrency, 100, 40);
        pop();
        
        // draw current health
        push();
        textSize(20);
        text(totalHealth, 40, 40);
        pop();

        // draw encyclopedia
        push();
        encyclopedia = createButton('Encyclopedia');
        encyclopedia.position(1057, 45);
        encyclopedia.mousePressed(showEncyclopedia);
        pop();

        // draw or remove enemie
        // iterate backwards to prevent flickering
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].hasReachedEnd()) {
                totalHealth -= enemies[i].damage;
                // Implement game over screen if needed
                enemies.splice(i, 1);
            } else if (enemies[i].health <= 0) {
                totalCurrency += enemies[i].currency;

                // handle spawner type enemies
                if (enemies[i].spawn) {
                    enemies[i].spawn(enemies);
                }
                
                enemies.splice(i, 1);
            } else {
                enemies[i].draw();
                
                // handle spawner type enemies
                if (enemies[i].spawn && !enemies[i].onCooldown) {
                    enemies[i].spawn(enemies);
                }
            }
        }

        // Draw bullets before towers
        for (const i in bullets) {
            if (bullets[i].isOutOfRange()) {
                bullets.splice(i, 1);
                continue;
            }
            
            if (bullets[i].hasHitTarget()) {
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
}

// Show the Encyclopedia when button is pressed. 
function showEncyclopedia() {
    
}

function mainMenu() {
    background('#262626');
    textFont(f_Andale);
    textAlign(CENTER);
    text("Press [ENTER] to start", 200, 300);
    fill('#FFF');
}

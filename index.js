import Enemy from "./enemy.js";
import { Tower, Bullet }  from "./tower.js";


// GLOBAL VARIABLES

const canvasWidth = 400;
const canvasHeight = 400;

// 0 - main menu
// 1 - start game
var gameMode = 0;
let f_Andale;

// buttons
let upgradeRange;
let upgradeFireRate;
let saveButton;
let loadSaveButton;

const path = [
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    { x: 150, y: 150 },
    { x: 250, y: 150 },
    { x: 250, y: 250 },
];

let enemies = [
    new Enemy(0.2, 10, path),
    new Enemy(0.3, 5, path)
];

// tower variables
const towerLimit = 5;
let towers = [];
let bullets = [];
let dragTower = null;
let playSound = false;

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
        // Check if mouse is inside canvas
        if ((event.button === 0 && !dragTower) && !(mouseX < 0 || mouseX > canvasWidth || mouseY < 0 || mouseY > canvasHeight)) {        
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

        // Skip if tower can't fire
        if(!t.canFire()) {
            continue;
        }

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
            bullets.push(t.fire(closestEnemy));
        }
    }
}


// GAME LOOP

let mySound;

window.preload = function(){
    mySound = loadSound('./assets/potassium.mp3');
    f_Andale = loadFont('./assets/Andale-Mono.ttf');
}

window.setup = function() {

    createCanvas(canvasWidth, canvasHeight);

    //Poll for bullets every 100ms
    setInterval(fireBullets, 100);
    upgradeRange = createButton('Upgrade Range');
    upgradeRange.position(0, 410);
    upgradeRange.mousePressed(function() {
        for(let t of towers) {
            t.range += 5;
        }
    });
    upgradeFireRate = createButton('Upgrade Fire Speed');
    upgradeFireRate.position(120, 410);
    upgradeFireRate.mousePressed(function() {
        for(let t of towers) {
            t.upgradeFireRate();
        }
    });

    saveButton = createButton('Save');
    saveButton.position(0, 430);
    saveButton.mousePressed(function() {
        // Save game state
        let saveState = {
            towers: towers,
            bullets: bullets,
            enemies: enemies
        };
        localStorage.setItem("saveState", JSON.stringify(saveState));
    });

    loadSaveButton = createButton('Load');
    loadSaveButton.position(50, 430);
    loadSaveButton.mousePressed(function() {
        // Load game state
        let saveState = JSON.parse(localStorage.getItem("saveState"));
        if(saveState) {

            // Load Tower data
            let towerData = JSON.parse(localStorage.getItem("saveState")).towers;
            for(let i = 0; i < towerData.length; i++) {
                let t = new Tower(towerData[i].x, towerData[i].y);
                t.range = towerData[i].range;
                t.damage = towerData[i].damage;
                t.fireRate = towerData[i].fireRate;
                t.coolDown = towerData[i].coolDown;

                towers.push(t);
            }

            // Load Bullet data
            let bulletData = JSON.parse(localStorage.getItem("saveState")).bullets;
            for(let i = 0; i < bulletData.length; i++) {
                let b = new Bullet(bulletData[i].tower, bulletData[i].target)
                b.x = bulletData[i].x
                b.y = bulletData[i].y
                b.range = bulletData[i].range
                b.damage = bulletData[i].damage
                b.target = bulletData[i].target
                b.angle = bulletData[i].angle
                b.xMove = bulletData[i].xMove
                b.yMove = bulletData[i].yMove
                    
                bullets.push(b);
            }
        }
    });

}

window.draw = function() {
    if (gameMode == 0) {
        mainMenu();

        // Hide upgrade buttons
        upgradeRange.hide();
        upgradeFireRate.hide();
        loadSaveButton.hide();
    }
    if (gameMode == 1) {

        // Show upgrade buttons
        upgradeRange.show();
        upgradeFireRate.show();
        loadSaveButton.show();

        background(200);

        if (!playSound) {
            mySound.setVolume(0.3);
            mySound.play();
            playSound = true;
        }

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
            if (enemies[i].hasReachedEnd() || enemies[i].health <= 0) {
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
    
}

function mainMenu() {
    background('#262626');
    textFont(f_Andale);
    textAlign(CENTER);
    text("Press [ENTER] to start", 200, 300);
    fill('#FFF');
}
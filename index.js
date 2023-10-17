import { Tank, Standard, Rapid, Wave } from "./enemy.js";
import { Tower, Bullet } from "./tower.js";
import { UIHandler } from "./ui-handler.js";

// GLOBAL VARIABLES

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const primaryColor = "color(237, 112, 192)"; // pink
const secondaryColor = "color(81, 176, 101)"; // green

// 0 - main menu
// 1 - start game
var gameMode = 0;
let f_Andale;
let beginGame = false;
let gameOver = false;
let game;

// map width & height
let windowWidth = 1200;
let windowHeight = 700;
let mapID = 2;

let uiHandler = new UIHandler(windowWidth, windowHeight);

/*
const path = [
    { x: 0, y: 230 },
    { x: 100, y: 270 },
    { x: 250, y: 260 },
    { x: 500, y: 235 },
    { x: 900, y: 220 },
    { x: 1000, y: 260 },
    { x: 1100, y: 300 },
    { x: 1150, y: 350 },
    { x: 1190, y: 420 },
]; */

export let maps = [
    {
        topPath: function(x) {
            return 166.8354 + 1.043129 * x - 0.003942524 * (x * x) + 0.00000607239 * (x * x * x) - 4.46637e-9 * (x * x * x * x) + 1.352265e-12 * (x * x * x * x * x);
        },
        middlePath: function(x) {
            return 246.768 + 0.6824144 * x - 0.002826065 * (x * x) + 0.000004403122 * (x * x * x) - 3.39375e-9 * (x * x * x * x) + 1.15278e-12 * (x * x * x * x * x);
        },
        bottomPath: function(x) {
            if (x < 768) {
                return (5.00842e-27 * Math.pow(x, 11) - 1.79629e-23 * Math.pow(x, 10)
                    + 2.6735e-20 * Math.pow(x, 9) - 2.14461e-17 * Math.pow(x, 8)
                    + 1.02276e-14 * Math.pow(x, 7) - 3.17496e-12 * Math.pow(x, 6)
                    + 7.82401e-10 * Math.pow(x, 5) - 1.90207e-7 * Math.pow(x, 4)
                    + 4.10456e-5 * Math.pow(x, 3) - 6.97063e-3 * Math.pow(x, 2)
                    + 7.67275e-1 * x + 3.11e2);
            }
            else if (x >= 768) {
                let t = x - 768;
                return (-3.17081e-23 * Math.pow(t, 11) + 7.03199e-20 * Math.pow(t, 10)
                    - 6.63488e-17 * Math.pow(t, 9) + 3.46794e-14 * Math.pow(t, 8)
                    - 1.09391e-11 * Math.pow(t, 7) + 2.12115e-9 * Math.pow(t, 6)
                    - 2.45005e-7 * Math.pow(t, 5) + 1.51765e-5 * Math.pow(t, 4)
                    - 3.54811e-4 * Math.pow(t, 3) - 3.55384e-3 * Math.pow(t, 2)
                    + 2.33631e-1 * t + 250);
            }
        },
        isColliding: function(x, diameter) {
            return mouseY < maps[0].bottomPath(x) && mouseY > maps[0].topPath(x) - diameter;
        }
    },
    {}
]; 

//////////////////////////////
// CONSTRUCT LEVEL
const waveAmount = 4;
let currentWave = 0;

const levelWaveData = [
    [0, 3],
    [0, 0, 6],
    [2],
    [0, 0, 0, 1]
];

const levelSpawnPriority = [
    [1, 0],
    [2, 1, 0],
    [0],
    [3, 2, 1, 0]
];

let enemies = [];
/////////////////////////////

// tower variables
const towerLimit = 5;
let towers = [];
let bullets = [];
let dragTower = null;
let playSound = false;

// other relevant variables
<<<<<<< Updated upstream
let totalCurrency = 550;
=======
let totalCurrency = 850;
>>>>>>> Stashed changes
let totalHealth = 50;

// checks for next wave button.
// can cause error if new ways that enemies disapear arise so keep in mind
let nextWaveCheck = { 
    amount: 0
}

let mapImg;
let towerSprite;
let mySound;
let deathSound;

window.preload = function () {
    mySound = loadSound('./assets/potassium.mp3');
    deathSound = loadSound('./assets/gta-v-wasted-death-sound.mp3')
    f_Andale = loadFont('./assets/Andale-Mono.ttf');
    towerSprite = loadImage('./assets/RedMoonTower.png');
    mapImg = loadImage('Maps/Space Map 1.png'); // Loads the Map

    uiHandler.preloadAssets();
}



// EVENT LISTENERS

window.mousePressed = function (event) {
    if (gameMode == 1 && uiHandler.ignoreNextClick == false && !uiHandler.encyclopediaOpen) {
        // Check if mouse is inside a tower
        for (let t = 0; t < towers.length; t++) {
            if (towers[t].mouseInside() && uiHandler.towerTool == 0) {
                dragTower = towers.splice(t, 1)[0];
                dragTower.hover = true;
                towers.push(dragTower);
                break;
            }
            
            if (towers[t].mouseInside() && towerTool == 1) {
                if(totalCurrency>=100){
                    towers[t].upgradeRange();
                    totalCurrency -=100;
                    break;
                }
            }

            if (towers[t].mouseInside() && towerTool == 2) {
                if(totalCurrency>= 150){
                    towers[t].upgradeFireRate();
                    totalCurrency -=150;
                    break;
                }
            }

            if (towers[t].mouseInside() && towerTool == 3) {
                if(totalCurrency>= 100){
                    towers[t].upgradeFireSpeed();
                    totalCurrency -=100;
                    break;
                }
            }
        }

        //Ignore touch events, only handle left mouse button
        // Check if mouse is inside canvas

        if (((event.button === 0 && !dragTower) && !(mouseX < 0 || mouseX > windowWidth - 50 || mouseY < 0 || mouseY + 50 > windowHeight)) && uiHandler.towerTool == 0) {
            try {
                if (towers.length > towerLimit) {
                    throw new Error("No more towers allowed!");
                }
<<<<<<< Updated upstream
                if (mouseY < maps[0].bottomPath(mouseX) + 10 && mouseY > maps[0].topPath(mouseX) - 35) {
=======
                if (maps[0].isColliding(mouseX, 30)) {
>>>>>>> Stashed changes
                    // throw new Error("Cannot place a tower on the path!");
                    return;
                }
                let t = new Tower(mouseX, mouseY);
                if (mouseX >= windowWidth - 15 && mouseY > 30 || mouseY < 70) {
                    // throw new Error("NO");
                } else {
                    if(totalCurrency<400){
                    }
                    else{  
                        towers.push(t);
                        totalCurrency -= 400;
                        }   
                }

            } catch (e) {
                alert(e);
            }
        }
    } else {
        uiHandler.ignoreNextClick = false;
    }
}

window.mouseDragged = function () {
    // Move tower if it's being dragged
    if (dragTower != null) {
        dragTower.x = mouseX;
        dragTower.y = mouseY;
    }
}

window.mouseReleased = function () {
    // Stop dragging tower
    if (dragTower != null) {
        dragTower.x = mouseX;
        dragTower.y = mouseY;
        dragTower.hover = false;
        dragTower = null;
    }
}

window.mouseMoved = function () {
    // Change cursor if mouse is inside a tower
    for (let t of towers) {
        if (t.mouseInside()) {
            t.hover = true;
            if(uiHandler.towerTool == 0) {
                cursor('grab');
            }
            if (uiHandler.towerTool == 1 || uiHandler.towerTool == 2 || uiHandler.towerTool == 3) {
                cursor('crosshair');
            }
            return;
        }
    }
    for (let t of towers) {
        t.hover = false;
    }
    cursor();
}

// HELPERS

function fireBullets() {
    // Generate bullets for each tower
    for (let t of towers) {

        // Skip if tower can't fire
        if (!t.canFire()) {
            continue;
        }

        let shortestDistance = Infinity;
        let closestEnemy = null;

        for (let e of enemies) {
            let xDist = e.x - t.x;
            let yDist = e.y - t.y;
            let distance = sqrt(xDist * xDist + yDist * yDist);

            if (distance < t.range && distance < shortestDistance) {
                shortestDistance = distance;
                closestEnemy = e;
            }
        }

        if (closestEnemy !== null) {
            bullets.push(t.fire(closestEnemy));
        }
    }
}
    
function dealDamage() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].damageTowers(towers);
    }
    for (let i = 0; i < towers.length; i++) {
        if (towers[i].health <= 0) {
            towers.splice(i, 1);
        }
    }
}

window.keyPressed = function () {
    if (keyCode === ESCAPE) { // use escape to open/close settings
        if (beginGame && !encyclopiaOpen)
            openSettings();
        if (encyclopiaOpen) {
            encyclopedia.hide();
            encyclopediaExit.hide();
            encyclopiaOpen = false;
        }
    }
}

window.setup = function () {
    game = createCanvas(windowWidth, windowHeight);
    
    uiHandler.initializeUI();
    
    uiHandler.onSaveClick = function () {
        // Save game state
        let saveState = {
            towers: towers,
            bullets: bullets,
            enemies: enemies
        };
        localStorage.setItem("saveState", JSON.stringify(saveState));
    };
    
    uiHandler.onLoadClick = function() {
        // Load game state
        let saveState = JSON.parse(localStorage.getItem("saveState"));
        if (saveState) {
            // Load Tower data
            let towerData = JSON.parse(localStorage.getItem("saveState")).towers;
            for (let i = 0; i < towerData.length; i++) {
                let t = new Tower(towerData[i].x, towerData[i].y);
                t.range = towerData[i].range;
                t.damage = towerData[i].damage;
                t.fireRate = towerData[i].fireRate;
                t.coolDown = towerData[i].coolDown;

                towers.push(t);
            }

            // Load Bullet data
            let bulletData = JSON.parse(localStorage.getItem("saveState")).bullets;
            for (let i = 0; i < bulletData.length; i++) {
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
    }

    uiHandler.onMuteClick = function() {
        if (playSound) {
            mySound.pause();
            this.playSound = false;
        } else {
            mySound.play();
            playSound = true;
        }
    }


    uiHandler.onStartClick = function () {

        if (!playSound) {
            mySound.setVolume(0.1);
            mySound.play();
            playSound = true;
        }
        beginGame = true;
    }

    uiHandler.onNextWaveClick = spawnNextWave;

    //Poll for bullets every 100ms

    setInterval(fireBullets, 100);
    setInterval(dealDamage, 100);
}



window.draw = function () {
    fill(0);

    if (gameMode == 0) {
        uiHandler.updateUIForGameMode(gameMode);

        // Switch to game mode
        if (beginGame) {
            gameMode = 1;
        }
    }
    if (gameMode == 1) {
        uiHandler.updateUIForGameMode(gameMode);
        
        // TODO
        if (nextWaveCheck.amount < 1) uiHandler.nextWaveButton.show();
        else uiHandler.nextWaveButton.hide();

        background(200);
        image(mapImg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);

        if (uiHandler.towerTool == 0 && totalCurrency >= 400) {
            push();
            if (maps[0].isColliding(mouseX, 30) || totalCurrency<400) {
                tint(255, 0, 0, 200);
            } else {
                tint(255, 200);
            }
            image(towerSprite, mouseX, mouseY, Tower.TOWER_SIZE, Tower.TOWER_SIZE);
            pop();
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
            t.draw(towerSprite);
        }
        // draw path

        /* push();
        strokeWeight(20);
        stroke(255, 255, 255, 255);
        noFill();
        beginShape();
        for (const point of path) {
            vertex(point.x, point.y);
        }
        endShape();
        pop(); */

        // draw currency holder
        push();
        textSize(20);
        fill('white');
        text(totalCurrency, 100, 40);
        pop();

        // draw current health
        push();
        textSize(20);
        fill('white');
        text(totalHealth, 40, 40);
        pop();

        if (totalHealth <= 0) {
            gameMode = -1;
            gameOver = true;
        }

         // draw Wave information
        push();
        textSize(20);
        fill('white');
        text('Wave: ' + currentWave + '/' + waveAmount, windowWidth - 120, windowHeight - 30);
        pop();

        // draw or remove enemies
        // iterate backwards to prevent flickering
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].hasReachedEnd()) {
                totalHealth -= enemies[i].damage;
                nextWaveCheck.amount -= 1;

                // Implement game over screen if needed
                enemies.splice(i, 1);
            } else if (enemies[i].health <= 0) {
                totalCurrency += enemies[i].currency;
                // handle spawner type enemies
                if (enemies[i].spawn) {
                    enemies[i].spawn(enemies, nextWaveCheck);
                }
                nextWaveCheck.amount -= 1;
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
    }

    if (gameMode == -1 && gameOver == true) {

        uiHandler.updateUIForGameMode(gameMode);
        
        game.hide();
        
        if (mySound.isPlaying()) {
            mySound.pause();
            deathSound.play();
        }
    }
}

// Spawns the next wave.
function spawnNextWave() {
    try {
        if (currentWave < waveAmount) {
            currentWave = currentWave + 1;
            for (let t = 0; t < levelWaveData[currentWave - 1].length; ++t)
                    nextWaveCheck.amount += levelWaveData[currentWave - 1][t];
            let newWave = spawnWave(levelWaveData, levelSpawnPriority, currentWave);
            newWave.debugPrintWave();
            newWave.spawn();
            console.log(newWave);

            enemies = newWave.getEnemies();
        } else {
            throw new Error("No more waves available");
        }
    } catch (e) {
        alert(e);
    }
}

/** Spawn a Wave
* @param {array} waveData - how many of each enemy type to spawn where array index = enemy type id 
* @param {array} spawnPriority - order to spawn enemy types in
* @param {number} currentLevel - the wave that the game is currently in. From 1 to waveAmount
*/
function spawnWave(waveData, spawnPriority, currentLevel) {
    const currentWave = new Wave(waveData[currentLevel - 1], spawnPriority[currentLevel - 1], maps[0].middlePath, 4);

    return currentWave;
}

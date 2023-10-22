import { Tank, Standard, Rapid, Wave, Stunner } from "./enemy.js";
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

let debugConsole;

let game;

// map width & height
let windowWidth = 1200;
let windowHeight = 700;

var mapID = 0;
var levelComplete = false;
// Select Map Function
function selectMap(mapID) {
    switch (mapID) {
        case 0:
            mapImg = loadImage('Maps/Space Map 1.png');
            break;
        case 1:
            mapImg = loadImage('Maps/Space Map Version 2.png');
            break;
        case 2:
            //mapImg = loadImage('Maps/Boss Map.png');
            break;
        default:
            break;
    }
    return;
}

// Reset the Map variables
function switchMap() {
    ++mapID;
    currentWave = 0;
    levelComplete = false;
    enemies = []; // Reset Enemies
    towers = []; // resets towers
    selectMap(mapID);
    nextLevel.hide();
    redraw();
}

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
// First map
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

// Second map
    {}
];

//////////////////////////////
// CONSTRUCT LEVEL
let currentWave = 0;

// The Level Data
const levels = [
    { // Level 1 Data
        leveldata: [
            [0, 3],
            [0, 0, 6],
            [2],
            [0, 0, 0, 1],
            [0, 0, 0, 0, 3]
        ],
        spawnPriority: [
            [1, 0],
            [2, 1, 0],
            [0],
            [3, 2, 1, 0],
            [4, 3, 2, 1, 0]
        ]
    },
    { // Level 2 Data
        leveldata: [
            [0, 3],
            [0, 0, 6],
            [2],
            [0, 0, 0, 1]
        ],
        spawnPriority: [
            [1, 0],
            [2, 1, 0],
            [0],
            [3, 2, 1, 0]
        ]
    }
];

// needs to be generalized for all levels
const waveAmount = levels[mapID].leveldata.length;

let enemies = [];

// tower variables
const towerLimit = 5;
let towers = [];
let bullets = [];
// let dragTower = null;
let playSound = false;
let placeTower = false;

// other relevant variables
let totalCurrency = 1000;
let totalHealth = 50;

// checks if wave is over
// can cause error if new ways that enemies disapear arise so keep in mind
let initNextWave = 20;
let nextWaveCheck = { 
    amount: 0
}

// checks for stunned towers
let stunCooldown = {
    amount: 0,
    trigger: 400
}

// Assets
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
    selectMap(mapID); // Loads the Map
    uiHandler.preloadAssets();
}

// EVENT LISTENERS

window.mousePressed = function (event) {
    if (gameMode == 1 && uiHandler.ignoreNextClick == false && !uiHandler.encyclopediaOpen) {
        // Check if mouse is inside a tower
        for (let t = 0; t < towers.length; t++) {
            if (towers[t].mouseInside()) {
                towers[t].selected = true;
                if (towers[t].isStunned()) towers[t].reduceStun(stunCooldown);
                // dragTower = towers.splice(t, 1)[0];
                // dragTower.hover = true;
                // towers.push(dragTower);
            } else {
                towers[t].selected = false;
            }
        }

        //Ignore touch events, only handle left mouse button
        // Check if mouse is inside canvas

        if (((event.button === 0 /* && !dragTower*/) && !(mouseX < 0 || mouseX > windowWidth - 50 || mouseY < 0 || mouseY + 50 > windowHeight))) {
            try {
                if (placeTower) {
                    console.log("test");
                    placeTower = false;
                    if (towers.length > towerLimit) {
                        throw new Error("No more towers allowed!");
                    }

                    if (maps[mapID].isColliding(mouseX, 30)) {
                        // throw new Error("Cannot place a tower on the path!");
                        return;
                    }
                    let t = new Tower(mouseX, mouseY);
                    if (mouseX >= windowWidth - 15 && mouseY > 30 || mouseY < 70) {
                        // throw new Error("NO");
                    } else {
                        if (totalCurrency < 400) {
                            throw new Error("Not enough money!");
                        }
                        else {
                            towers.push(t);
                            totalCurrency -= 400;
                        }
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

// window.mouseDragged = function () {
//     // Move tower if it's being dragged
//     if (dragTower != null) {
//         dragTower.x = mouseX;
//         dragTower.y = mouseY;
//     }
// }

// window.mouseReleased = function () {
//     // Stop dragging tower
//     if (dragTower != null) {
//         dragTower.x = mouseX;
//         dragTower.y = mouseY;
//         dragTower.hover = false;
//         dragTower = null;
//     }
// }

window.mouseMoved = function () {
    // Change cursor if mouse is inside a tower
    for (let t of towers) {
        if (t.mouseInside()) {
            t.hover = true;
            // if(uiHandler.towerTool == 0) {
            cursor('grab');
            // }
            // if (uiHandler.towerTool == 1 || uiHandler.towerTool == 2 || uiHandler.towerTool == 3) {
            //     cursor('crosshair');
            // }
            return;
        }
    }
    for (let t of towers) {
        t.hover = false;
    }
    cursor();
}

// HELPERS

function getSelectedTower() {
    for (let t of towers) {
        if (t.selected) {
            return t;
        }
    }
}

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

window.keyPressed = function (e) {
    if (keyCode === ESCAPE) { // use escape to open/close settings
        if (beginGame && !encyclopiaOpen)
            openSettings();
        if (encyclopiaOpen) {
            encyclopedia.hide();
            encyclopediaExit.hide();
            encyclopiaOpen = false;
        }
    }
    if(e.key === 'd') { // use d to open/close debug console
        let gameData = {
            gameMode: gameMode,
            totalCurrency: totalCurrency,
            totalHealth: totalHealth,
            waveAmount: waveAmount,
            currentWave: currentWave,
            towers: towers,
            enemies: enemies,

        }
        console.log(gameData);
        uiHandler.showDebugConsole(JSON.stringify(gameData));
    }
    if(e.keyCode == 67 && e.altKey) {
        console.log("Adding 1000 currency");
        totalCurrency += 1000;
    }

}

window.setup = function () {
    game = createCanvas(windowWidth, windowHeight);
    
    uiHandler.initializeUI();

    
    uiHandler.saveButton.mousePressed(function() {
        // Save game state
        let saveState = {
            towers: towers,
            bullets: bullets,
            enemies: enemies
        };
        localStorage.setItem("saveState", JSON.stringify(saveState));
    });
    
    uiHandler.loadButton.mousePressed(function() {
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
    });

    uiHandler.muteButton.mousePressed(function() {
        if (playSound) {
            mySound.pause();
            this.playSound = false;
        } else {
            mySound.play();
            playSound = true;
        }
    });


    console.log("test");
    uiHandler.startButton.mousePressed(function() {
        console.log("test");
        if (!playSound) {
            mySound.setVolume(0.1);
            mySound.play();
            playSound = true;
        }
        beginGame = true;
    });

    // uiHandler.nextWaveButton.mousePressed(function() {
    //     spawnNextWave();
    // });

    uiHandler.placeTowerButton.mousePressed(function() {
        placeTower = true;
    });

    uiHandler.upgradeFireRateButton.mousePressed(function() {
        let selectedUpgradeTower = getSelectedTower();
        selectedUpgradeTower.upgradeFireRate();
    });

    uiHandler.upgradeFireSpeedButton.mousePressed(function() {
        let selectedUpgradeTower = getSelectedTower();
        selectedUpgradeTower.upgradeFireSpeed();
    });
    
    uiHandler.upgradeRangeButton.mousePressed(function() {
        let selectedUpgradeTower = getSelectedTower();
        selectedUpgradeTower.upgradeRange();
    });

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

        if (getSelectedTower()) {
            uiHandler.upgradeFireRateButton.show();
            uiHandler.upgradeRangeButton.show();
            uiHandler.upgradeFireSpeedButton.show();
        } else {
            uiHandler.upgradeFireRateButton.hide();
            uiHandler.upgradeRangeButton.hide();
            uiHandler.upgradeFireSpeedButton.hide();
        }
        
        // TODO
        // if (nextWaveCheck.amount < 1) uiHandler.nextWaveButton.show();
        // else uiHandler.nextWaveButton.hide();

        background(200);
        image(mapImg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
        
        // Displays Level Complete Text when all waves are done
        if (levelComplete) {
            push();
            textAlign(CENTER);
            textSize(40)
            fill('red');
            text('Level Complete', 600, 100);
            pop();
        }
        if (placeTower) {
            push();
            if (maps[0].isColliding(mouseX, 30) || totalCurrency < 400) {
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
            if (t.isStunned()) t.drawStunned();
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

        if (nextWaveCheck.amount < 1) {
            if (currentWave == 0) {
                push();
                textSize(20);
                fill('white');
                text("Game starts in: " + initNextWave, windowWidth - 200, windowHeight - 50);
                pop();
            }
            else if (currentWave < waveAmount) {
                push();
                textSize(20);
                fill('white');
                text("Next wave in: " + initNextWave, windowWidth - 185, windowHeight - 50);
                pop();
            }
            if (frameCount % 60 == 0 && initNextWave > 0) initNextWave--;
            if (initNextWave == 0) {
                if (currentWave < waveAmount) spawnNextWave();
                initNextWave = 10;
            }
        }
        //console.log(initNextWave);
        // uiHandler.nextWaveButton.show();
        // else uiHandler.nextWaveButton.hide();

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
        text('Wave: ' + currentWave + '/' + levels[mapID].leveldata.length, windowWidth - 120, windowHeight - 25);
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
                // handle stunner type enemies
                if (enemies[i].stunTower) {
                    if (stunCooldown.amount < stunCooldown.trigger) stunCooldown.amount++;
                    else {
                        let n = towers.length;
                        let stunIndex = enemies[i].stunTower(n);
                        if (stunIndex != -1) {
                            while (stunIndex < n && towers[stunIndex].isStunned()) {
                                stunIndex ++
                            }
                            if (stunIndex < n) towers[stunIndex].stun();
                        }
                        stunCooldown.amount = 0;
                    }
                }
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
        if (currentWave < levels[mapID].leveldata.length) {
            currentWave = currentWave + 1;

            let newWave = spawnWave(levels[mapID].leveldata, levels[mapID].spawnPriority, currentWave);
            for (let t = 0; t < levels[mapID].leveldata[currentWave - 1].length; ++t)
                nextWaveCheck.amount += levels[mapID].leveldata[currentWave - 1][t];
            newWave.debugPrintWave();
            newWave.spawn();
            console.log(newWave);

            enemies = newWave.getEnemies();
        } else {
            // Next Level Button and Level Complete text Appears after all the Waves are done.
            nextLevel.show(); 
            levelComplete = true;
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
    const currentWave = new Wave(waveData[currentLevel - 1], spawnPriority[currentLevel - 1], maps[mapID].middlePath, 4);

    return currentWave;
}

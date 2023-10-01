import { Tank, Standard, Rapid, Wave } from "./enemy.js";
import { Tower, Bullet } from "./tower.js";


// GLOBAL VARIABLES

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

const primaryColor = "color(237, 112, 192)"; // pink
const secondaryColor = "color(81, 176, 101)"; // green

// 0 - main menu
// 1 - start game
var gameMode = 0;
let f_Andale;

// 0 - place tower (default)
// 1 - upgrade range
// 2 - upgrade fire rate
let towerTool = 0;
let beginGame = false;

// buttons
let upgradeRange;
let upgradeFireRate;
let placeTower;
let saveButton;
let loadSaveButton;

// map width & height
let windowWidth = 1200;
let windowHeight = 700;

/*
const path = [
    { x: 0, y: 230 },
    { x: 100, y: 250 },
    { x: 250, y: 240 },
    { x: 500, y: 225 },
    { x: 900, y: 210 },
    { x: 1100, y: 260 },
    { x: 1150, y: 330 },
    { x: 1190, y: 420 },
]; */

function path(x) { return 246.768 + 0.6824144*x - 0.002826065*(x*x) + 0.000004403122*(x*x*x) - 3.39375e-9*(x*x*x*x) + 1.15278e-12*(x*x*x*x*x); }

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
/*
const test_waveData = [1, 3, 4, 1];
const test_spawnPriority = [1, 2, 0, 3];

const newWave = new Wave(test_waveData, test_spawnPriority, path, 4);

newWave.debugPrintWave();
newWave.spawn();
const enemies = newWave.getEnemies();
*/

// tower variables
const towerLimit = 5;
let towers = [];
let bullets = [];
let dragTower = null;
let playSound = false;

// other relevant variables
let totalCurrency = 0;
let totalHealth = 50;
let encyclopedia;
let nextWave;


let mapImg;
let titleImg;
var startButton;
var towerSprite;

window.preload = function () {
    mySound = loadSound('./assets/potassium.mp3');
    f_Andale = loadFont('./assets/Andale-Mono.ttf');
    towerSprite = loadImage('./assets/RedMoonTower.png');
    mapImg = loadImage('Maps/Space Map 1.png'); // Loads the Map
    titleImg = loadImage('./assets/GalacticGuardiansLogo2.png');
}



// EVENT LISTENERS

window.mousePressed = function (event) {
    if (gameMode == 1) {
        console.log(event);

        // Check if mouse is inside a tower
        for(let t = 0; t < towers.length; t++) {
            if (towers[t].mouseInside() && towerTool == 0) {
                dragTower = towers.splice(t, 1)[0];
                dragTower.hover = true;
                towers.push(dragTower);
                break;
            }

            if (towers[t].mouseInside() && towerTool == 1) {
                towers[t].upgradeRange();
                break;
            }

            if (towers[t].mouseInside() && towerTool == 2) {
                towers[t].upgradeFireRate();
                break;
            }
        }

        //Ignore touch events, only handle left mouse button
        // Check if mouse is inside canvas
        if (((event.button === 0 && !dragTower) && !(mouseX < 0 || mouseX > windowWidth - 50 || mouseY < 0 || mouseY + 50 > windowHeight))&& towerTool == 0) {        
            try {
                if (towers.length > towerLimit) {
                    throw new Error("No more towers allowed!");
                }
                let t = new Tower(mouseX, mouseY);
                if (mouseX >= windowWidth - 15 && mouseY > 30 || mouseY < 70) {
                    // throw new Error("NO");
                } else {
                    towers.push(t);
                }

            } catch (e) {
                alert(e);
            }
        }
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
            if(towerTool == 0) {
                cursor('grab');
            }
            if (towerTool == 1 || towerTool == 2) {
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


// GAME LOOP
let mySound;

let settingsOpen = false;
let settings;
let settingsMute;

window.keyPressed = function() {
    if (keyCode === ESCAPE) { // use escape to open/close settings
        if (beginGame)
            openSettings();
    }
}

window.setup = function () {

    createCanvas(windowWidth, windowHeight);

    //Poll for bullets every 100ms

    setInterval(fireBullets, 100);
    placeTower = createButton('Place Tower');
    placeTower.style('font-family', 'Andale Mono');
    placeTower.style('font-size', '18px');
    placeTower.style('color', color(181, 43, 131));
    placeTower.style('background-color', color(81,176,101));
    placeTower.style('border', 'none');
    placeTower.style('border-radius', '5px');
    placeTower.style('padding', '5px 10px');
    placeTower.style('font-weight', 'bold');
    placeTower.position(10, windowHeight + 40);
    placeTower.mousePressed(function() {
        towerTool = 0;
    });

    upgradeRange = createButton('Upgrade Range');
    upgradeRange.style('font-family', 'Andale Mono');
    upgradeRange.style('font-size', '18px');
    upgradeRange.style('color', color(181, 43, 131));
    upgradeRange.style('background-color', color(81,176,101));
    upgradeRange.style('border', 'none');
    upgradeRange.style('border-radius', '5px');
    upgradeRange.style('padding', '5px 10px');
    upgradeRange.style('font-weight', 'bold');
    upgradeRange.position(160, windowHeight + 40);
    upgradeRange.mousePressed(function() {
        towerTool = 1;
    });
    upgradeFireRate = createButton('Upgrade Fire Speed');
    upgradeFireRate.style('font-family', 'Andale Mono');
    upgradeFireRate.style('font-size', '18px');
    upgradeFireRate.style('color', color(181, 43, 131));
    upgradeFireRate.style('background-color', color(81,176,101));
    upgradeFireRate.style('border', 'none');
    upgradeFireRate.style('border-radius', '5px');
    upgradeFireRate.style('padding', '5px 10px');
    upgradeFireRate.style('font-weight', 'bold');
    upgradeFireRate.position(335, windowHeight + 40);
    upgradeFireRate.mousePressed(function() {
        towerTool = 2;
    });

    saveButton = createImg('./assets/saveButton.png');
    saveButton.addClass('settingsMenu');
    saveButton.size(100,40);
    saveButton.position(windowWidth-265, 10);
    saveButton.mousePressed(function() {
        // Save game state
        let saveState = {
            towers: towers,
            bullets: bullets,
            enemies: enemies
        };
        localStorage.setItem("saveState", JSON.stringify(saveState));
    });

    loadSaveButton = createImg('./assets/loadButton.png');
    loadSaveButton.addClass('settingsMenu');
    loadSaveButton.size(100,40);
    loadSaveButton.position(windowWidth-160,10);
    loadSaveButton.mousePressed(function() {
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

    imageMode(CENTER);

    image(titleImg, windowWidth/2, (windowHeight/2)-100, 650, 375);

    startButton = createImg('./assets/GalacticGuardiansStartBtn.png');
    startButton.addClass('startButton');
    startButton.size(200,100);
    startButton.mousePressed(function() {
        if (!playSound) {
            mySound.setVolume(0.1);
            mySound.play();
            playSound = true;
        }
        beginGame = true;
    });

    // // draw encyclopedia
    // push();
    // encyclopedia = createButton('Encyclopedia');
    // encyclopedia.position(1057, 150);
    // encyclopedia.mousePressed(showEncyclopedia);
    // pop();

    // draw "next wave" button
    push();
    nextWave = createButton('Next Wave')
    nextWave.position(windowWidth - 100, windowHeight + 15);
    nextWave.mousePressed(spawnNextWave);
    pop();

    settings = createImg('./assets/settingsbutton.png');
    settings.addClass('settingsMenu');
    settings.position(windowWidth-50, 10);
    settings.size(40,40);
    settingsMute = createImg('./assets/audiobutton.png');
    settingsMute.addClass('settingsMenu');
    settingsMute.position(windowWidth-50, 60);
    settingsMute.size(40,40);
        settingsMute.mousePressed(function() {
            if (playSound) {
                mySound.pause();
                playSound = false;
            } else {
                mySound.play();
                playSound = true;
            }
            })
        
        
}



window.draw = function() {
    fill(0);

    if (gameMode == 0) {

        // Hide buttons
        upgradeRange.hide();
        upgradeFireRate.hide();
        loadSaveButton.hide();
        placeTower.hide();
        saveButton.hide();
        nextWave.hide();

        settings.hide();
        settingsMute.hide();

        // Switch to game mode
        if (beginGame) {
            gameMode = 1;
        }
    }
    if (gameMode == 1) {

        // Show upgrade buttons
        upgradeRange.show();
        upgradeFireRate.show();
        startButton.hide();
        nextWave.show();

        settings.show();
        settings.mousePressed(openSettings);

        background(200);
        image(mapImg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);

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

        // Draw tower upgrade menu
        towerUpgradeMenu(windowHeight + 50, canvasWidth);
    }
}

// Show the Encyclopedia when button is pressed. 
function showEncyclopedia() {

}

// Spawns the next wave.
function spawnNextWave() {
    try {
        if (currentWave < waveAmount) {
            currentWave = currentWave + 1;
            let newWave = spawnWave(levelWaveData, levelSpawnPriority, currentWave);
            newWave.debugPrintWave();
            newWave.spawn();
            console.log(newWave)

            enemies = newWave.getEnemies();
            console.log(enemies);
        } else {
            throw new Error("No more waves available");
        }
    } catch(e) {
        alert(e);
    }
}

/** Spawn a Wave
* @param {array} waveData - how many of each enemy type to spawn where array index = enemy type id 
* @param {array} spawnPriority - order to spawn enemy types in
* @param {number} currentLevel - the wave that the game is currently in. From 1 to waveAmount
*/
function spawnWave(waveData, spawnPriority, currentLevel) {
    const currentWave = new Wave(waveData[currentLevel - 1], spawnPriority[currentLevel - 1], path, 4);

    return currentWave;
}

function towerUpgradeMenu(height, width) {

    const toolbarColor = color(51, 51, 51);
    toolbarColor.setAlpha(200);

    placeTower.show();
    upgradeRange.show();
    upgradeFireRate.show();

    // Update button colors
    switch(towerTool) {
        case 0:
            placeTower.style('background-color', color(181, 43, 131));
            placeTower.style('color', color(81,176,101));
            upgradeRange.style('background-color', color(81,176,101));
            upgradeRange.style('color', color(181, 43, 131));
            upgradeFireRate.style('background-color', color(81,176,101));
            upgradeFireRate.style('color', color(181, 43, 131));
            break;
        case 1:
            placeTower.style('background-color', color(81,176,101));
            placeTower.style('color', color(181, 43, 131));
            upgradeRange.style('background-color', color(181, 43, 131));
            upgradeRange.style('color', color(81,176,101));
            upgradeFireRate.style('background-color', color(81,176,101));
            upgradeFireRate.style('color', color(181, 43, 131));
            break;
        case 2:
            placeTower.style('background-color', color(81,176,101));
            placeTower.style('color', color(181, 43, 131));
            upgradeRange.style('background-color', color(81,176,101));
            upgradeRange.style('color', color(181, 43, 131));
            upgradeFireRate.style('background-color', color(181, 43, 131));
            upgradeFireRate.style('color', color(81,176,101));
            break;
    }

    push();
    fill(toolbarColor);
    noStroke();
    rect(0, height - 50, width, 50);
    pop();
}

function openSettings() {
    if (!settingsOpen) {
        settingsMute.show();
        loadSaveButton.show();
        saveButton.show();
        settingsOpen = true;
    } else {
        settingsMute.hide();
        loadSaveButton.hide();
        saveButton.hide();
        settingsOpen = false;
    }
}

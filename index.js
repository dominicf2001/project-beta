
import { Wave, Standard as StandardEnemy, Rapid, Tank, Spawner, Stunner, Boss } from "./enemy.js";
import { Tower, Standard, Freezer, Poisoner, Bullet, towerCosts } from "./tower.js";
import { UIHandler } from "./ui-handler.js";
import { WINDOW_WIDTH, WINDOW_HEIGHT,
         TOWER_LIMIT, DEFAULT_CURRENCY, DEFAULT_WAVE_INIT_TIME,
         DEFAULT_HEALTH, LEVELS, MAPS, ENEMIES } from './config.js';


// ---------------------------------------------------------------------
// GLOBAL VARIABLES
// ---------------------------------------------------------------------

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// STATE VARIABLES -----------
// 0 - main menu
// 1 - start game
var gameMode = 0;
let beginGame = false;
let gameOver = false;
var levelComplete = false;
let playSound = false;
let currentWave = 0;

// ENTITIES -----------
let enemies = [];
let towers = [];
let bullets = [];

// PLAYER RESOURCES -----------
let totalCurrency = DEFAULT_CURRENCY;
let totalHealth = DEFAULT_HEALTH;

// MISC VARIABLES -----------

// Tutorial States
let tutorialTask = 0;
let task3Currency = 1000000;
let waitBeforeNextTask = 0;

// let dragTower = null;
let towerToPlace = null;
const towerLimit = TOWER_LIMIT;
// checks if wave is over
// can cause error if new ways that enemies disapear arise so keep in mind
let initNextWave = DEFAULT_WAVE_INIT_TIME + 5;
let nextWaveCheck = {
    amount: 0
}
// checks for stunned towers
let stunCooldown = {
    amount: 0,
    trigger: 400
}
const uiHandler = new UIHandler(WINDOW_WIDTH, WINDOW_HEIGHT);
let debug
let game;
export var mapID = 0;
// needs to be generalized for all levels
var waveAmount = LEVELS[mapID].LEVEL_DATA.length;
// ---------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------

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

// Select Map Function
function selectMap(mapID) {
    switch (mapID) {
        case 0:
            mapImg = loadImage('Maps/Space Map 1.png');
            currentLevelMusic = level1Music;
            currentLevelMusic.setVolume(0.1);
            break;
        case 1:
            mapImg = loadImage('Maps/Space Ship Map.png');
            currentLevelMusic = level2Music;
            currentLevelMusic.setVolume(0.1);
            break;
        case 2:
            mapImg = loadImage('Maps/Boss Map no Path v3.png');
            currentLevelMusic = level3Music;
            currentLevelMusic.setVolume(0.1);
            break;
        case 3:
            // Tutorial Map
            mapImg = loadImage('Maps/Space Map 1.png');
            currentLevelMusic = level1Music;
            currentLevelMusic.setVolume(0.1);
            break;
        default:
            break;
    }
    return;
}

// Reset the Map variables
function switchMap() {
    if(mapID == 3) {
        mapID = 0;
        totalCurrency = DEFAULT_CURRENCY;
        totalHealth = DEFAULT_HEALTH;
        beginGame = false;
        gameOver = false;
        levelComplete = false;
    } else {
        ++mapID;
    }
    totalCurrency = DEFAULT_CURRENCY;
    initNextWave = 10;
    currentWave = 0;
    waveAmount = LEVELS[mapID].LEVEL_DATA.length;
    levelComplete = false;
    currentLevelMusic.stop();
    enemies = []; // Reset Enemies
    towers = []; // resets towers
    selectMap(mapID);
    uiHandler.nextLevelButton.hide();
    currentLevelMusic.loop();
    redraw();
}

// Spawns the next wave.
function spawnNextWave() {
    try {
        if (currentWave < LEVELS[mapID].LEVEL_DATA.length) {
            currentWave = currentWave + 1;

            let newWave = spawnWave(LEVELS[mapID].LEVEL_DATA, LEVELS[mapID].PRIORITY_DATA, currentWave);
            for (let i = 0; i < ENEMIES.length; ++i) 
                for (let j = 0; j < LEVELS[mapID].LEVEL_DATA[currentWave - 1][i].length; ++j)
                    nextWaveCheck.amount += LEVELS[mapID].LEVEL_DATA[currentWave - 1][i][j];
                
            newWave.debugPrintWave();
            newWave.spawn();
            enemies = newWave.getEnemies();
        }
    }
    catch (e) {
        alert(e);
    }
}

/** Spawn a Wave
* @param {array} waveData - how many of each enemy type to spawn where array index = enemy type id 
* @param {array} PRIORITY_DATA - order to spawn enemy types in
* @param {number} currentLevel - the wave that the game is currently in. From 1 to waveAmount
*/
function spawnWave(waveData, PRIORITY_DATA, currentLevel) {
    const currentWave = new Wave(waveData[currentLevel - 1], PRIORITY_DATA[currentLevel - 1], MAPS[mapID].middlePath, 4);
    return currentWave;
}

// ---------------------------------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------------------------------

// Assets
let mapImg;
let towerSprite;
let freezerTowerSprite;
let poisonerTowerSprite;
let currentLevelMusic;
let titleScreenMusic;
let level1Music;
let level2Music;
let level3Music;
let deathSound;
let basicEnemy;
let summonerEnemy;
let summoneeEnemy;
let tankEnemy;
let bossEnemy;
let stunEnmeny;
let healthSprite;
let coinSprite;
let enemyDeathSound_default;
let enemyDeathSound_squid;
let enemyDeathSound_summoner;
let enemyDeathSound_zombie;
let f_Andale;
let playTitleScreenMusic = false;

window.preload = function () {
    // Loads the Level Music
    level1Music = loadSound('./assets/potassium.mp3');
    level2Music = loadSound('./assets/Project_Beta_Song2.mp3');
    level3Music = loadSound('./assets/Project_Beta_Boat_Song.mp3');
    deathSound = loadSound('./assets/gta-v-wasted-death-sound.mp3');
    titleScreenMusic = loadSound('./assets/Galactic_Guardians_Title_Song.mp3');

    // Enemy sounds
    enemyDeathSound_default = loadSound('./assets/enemyDeathSound_default.mp3');
    enemyDeathSound_squid = loadSound('./assets/enemyDeathSound_squid.mp3');
    enemyDeathSound_summoner = loadSound('./assets/enemyDeathSound_summoner.mp3');
    enemyDeathSound_zombie = loadSound('./assets/enemyDeathSound_zombie.mp3');

    f_Andale = loadFont('./assets/Andale-Mono.ttf');
    towerSprite = loadImage('./assets/RedMoonTower.png');
    freezerTowerSprite = loadImage('./assets/FreezerTower.png');
    poisonerTowerSprite = loadImage('./assets/PoisonTower.png');
    selectMap(mapID); // Loads the Map
    uiHandler.preloadAssets();
    basicEnemy = loadImage('./assets/Basic_Enemy.gif');
    summonerEnemy = loadImage('./assets/Summoner_Animated.gif');
    summoneeEnemy = loadImage('./assets/Summonee_Animated.gif');
    tankEnemy = loadImage('./assets/Tank_Enemy.gif');
    bossEnemy = loadImage('./assets/Boss_Boat.gif');


    healthSprite = loadImage('./assets/heart.png');
    coinSprite = loadImage('./assets/coin.png');
}

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

        if (((event.button === 0 /* && !dragTower*/) && !(mouseX < 0 || mouseX > WINDOW_WIDTH - 50 || mouseY < 0 || mouseY + 50 > WINDOW_HEIGHT))) {
            try {
                if (towerToPlace) {
                    // if (towers.length > towerLimit) {
                    //     throw new Error("No more towers allowed!");
                    // }

                    if (MAPS[mapID].isColliding(mouseX, 30)) {
                        // throw new Error("Cannot place a tower on the path!");
                        return;
                    }

                    if (mouseX >= WINDOW_WIDTH - 15 && mouseY > 30 || mouseY < 70) {
                        // throw new Error("NO");
                    } else {
                        if (totalCurrency < towerToPlace.placeTowerCost) {
                            throw new Error("Not enough money!");
                        }
                        else {
                            towerToPlace.x = mouseX;
                            towerToPlace.y = mouseY;
                            towers.push(towerToPlace);
                            totalCurrency -= towerToPlace.placeTowerCost;
                        }
                    }
                    towerToPlace = null;
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


window.keyPressed = function (e) {
    if (keyCode === ESCAPE) { // use escape to open/close settings
        towerToPlace = null;
    }
    if (e.key === 'd') { // use d to open/close debug console
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
    
    if (e.altKey) {
        if (e.key == 'z') {
            console.log("Adding 10 currency");
            totalCurrency += 10;
        }

        if (e.key == 'x') {
            console.log("Adding 100 currency");
            totalCurrency += 100;
        }
        
        if (e.key == 'c') {
            console.log("Adding 1000 currency");
            totalCurrency += 1000;
        }
    }

    if (e.ctrlKey) {
        if (e.key == 'z') {
            console.log("Adding 10 health ");
            totalHealth += 10;
        }

        if (e.key == 'x') {
            console.log("Adding 100 health");
            totalHealth += 100;
        }

        if (e.key == 'c') {
            console.log("Adding 1000 health");
            totalHealth += 1000;
        }
    }
}



window.setup = function () {

    console.log("Wave amount",LEVELS[mapID]);

    game = createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);

    uiHandler.initializeUI();

    uiHandler.saveButton.mousePressed(function () {
        saveGame();
    });

    uiHandler.tutorialNextButton.mousePressed(function() {
        if(tutorialTask == 6) {
            switchMap();
        }
        tutorialTask++;
        uiHandler.tutorialNextButton.hide();
    });

    uiHandler.muteButton.mousePressed(function() {
        if (playSound) {
            currentLevelMusic.pause();
            playSound = false;
            uiHandler.muteButton.html('volume_off');
            localStorage.setItem("mute", true);
        } else {
            currentLevelMusic.loop();
            playSound = true;
            uiHandler.muteButton.html('volume_up');
            localStorage.setItem("mute", false);
        }
    });
    
    uiHandler.startButton.mousePressed(function() {
        selectMap(mapID);
        if (!playSound) {
            currentLevelMusic.setVolume(0.1);
            currentLevelMusic.loop();
            playSound = true;
        }
        beginGame = true;
        mapID = 0;
    });

    uiHandler.settingsButton.mousePressed(function() {
        uiHandler.toggleSettings();
    })

    uiHandler.gameExit.mousePressed(function() {
        saveGame();
        window.location.reload();
    });

    uiHandler.toggleCoinsIncrease.mousePressed(function () {
        totalCurrency += 100;
    });
    uiHandler.toggleCoinsDecrease.mousePressed(function () {
        totalCurrency -= 100;
    });
    uiHandler.toggleHealthIncrease.mousePressed(function () {
        totalHealth += 5;
    });
    uiHandler.toggleHealthDecrease.mousePressed(function () {
        totalHealth -= 5;
    });

    uiHandler.loadButton.mousePressed(function () {
        if (!playSound) {
            currentLevelMusic.setVolume(0.1);
            currentLevelMusic.loop();
            playSound = true;
        }
        beginGame = true;
        currentWave = 0;
        loadGame();
    });

    uiHandler.launchTutorialButton.mousePressed(function() {
        if (!playSound) {
            currentLevelMusic.setVolume(0.1);
            currentLevelMusic.loop();
            playSound = true;
        }
        mapID = 3;
        selectMap(mapID);
        beginGame = true;
    });

    uiHandler.level1Button.mousePressed(function() {
        mapID = 0;
        selectMap(mapID);
        currentWave = 0;
        waveAmount = LEVELS[mapID].LEVEL_DATA.length;
        levelComplete = false;
        currentLevelMusic.stop();
        enemies = []; // Reset Enemies
        towers = []; // resets towers
        uiHandler.nextLevelButton.hide();
        if (!playSound) {
            currentLevelMusic.setVolume(0.1);
            currentLevelMusic.loop();
            playSound = true;
        }
        beginGame = true;
    });
    uiHandler.level2Button.mousePressed(function() {
        mapID = 1;
        selectMap(mapID);
        currentWave = 0;
        waveAmount = LEVELS[mapID].LEVEL_DATA.length;
        levelComplete = false;
        currentLevelMusic.stop();
        enemies = []; // Reset Enemies
        towers = []; // resets towers
        uiHandler.nextLevelButton.hide();
        if (!playSound) {
            currentLevelMusic.setVolume(0.1);
            currentLevelMusic.loop();
            playSound = true;
        }
        beginGame = true;
    });
    uiHandler.level3Button.mousePressed(function() {
        mapID = 2;
        selectMap(mapID);
        currentWave = 0;
        waveAmount = LEVELS[mapID].LEVEL_DATA.length;
        levelComplete = false;
        currentLevelMusic.stop();
        enemies = []; // Reset Enemies
        towers = []; // resets towers
        uiHandler.nextLevelButton.hide();
        if (!playSound) {
            currentLevelMusic.setVolume(0.1);
            currentLevelMusic.loop();
            playSound = true;
        }
        beginGame = true;
    });

    // uiHandler.nextWaveButton.mousePressed(function() {
    //     spawnNextWave();
    // });

    uiHandler.placeStandardButton.mousePressed(function (e) {
        console.log(!towerToPlace);
        if (!towerToPlace && totalCurrency >= towerCosts["standard"].placeTowerCost) {
            e.stopPropagation();
            towerToPlace = new Standard();
        }
    });

    uiHandler.placeFreezerButton.mousePressed(function (e) {
        if (!towerToPlace && totalCurrency >= towerCosts["freezer"].placeTowerCost) {
            e.stopPropagation();
            towerToPlace = new Freezer();
        }
    });

    uiHandler.placePoisonerButton.mousePressed(function (e) {
        if (!towerToPlace && totalCurrency >= towerCosts["poisoner"].placeTowerCost) {
            e.stopPropagation();
            towerToPlace = new Poisoner();
        }
    });

    uiHandler.upgradeRangeButton.mousePressed(function () {
        let selectedUpgradeTower = getSelectedTower();
        switch (selectedUpgradeTower.constructor.name) {
            case "Standard":
                if (totalCurrency >= towerCosts["standard"].rangeCost) {
                    selectedUpgradeTower.upgradeRange();
                    totalCurrency -= towerCosts["standard"].rangeCost;
                }
                break;

            case "Poisoner":
                if (totalCurrency >= towerCosts["poisoner"].rangeCost) {
                    selectedUpgradeTower.upgradeRange();
                    totalCurrency -= towerCosts["poisoner"].rangeCost;
                }
                break;

            case "Freezer":
                if (totalCurrency >= towerCosts["freezer"].rangeCost) {
                    selectedUpgradeTower.upgradeRange();
                    totalCurrency -= towerCosts["freezer"].rangeCost;
                }
                break;
        }
    });

    uiHandler.upgradeFireRateButton.mousePressed(function () {
        let selectedUpgradeTower = getSelectedTower();
        switch (selectedUpgradeTower.constructor.name) {
            case "Standard":
                if (totalCurrency >= towerCosts["standard"].fireRateCost) {
                    selectedUpgradeTower.upgradeFireRate();
                    totalCurrency -= towerCosts["standard"].fireRateCost;
                }
                break;

            case "Poisoner":
                if (totalCurrency >= towerCosts["poisoner"].fireRateCost) {
                    selectedUpgradeTower.upgradeFireRate();
                    totalCurrency -= towerCosts["poisoner"].fireRateCost;
                }
                break;

            case "Freezer":
                if (totalCurrency >= towerCosts["freezer"].fireRateCost) {
                    selectedUpgradeTower.upgradeFireRate();
                    totalCurrency -= towerCosts["freezer"].fireRateCost;
                }
                break;
        }
    });

    uiHandler.upgradeFireSpeedButton.mousePressed(function () {
        let selectedUpgradeTower = getSelectedTower();
        switch (selectedUpgradeTower.constructor.name) {
            case "Standard":
                if (totalCurrency >= towerCosts["standard"].fireSpeedCost) {
                    selectedUpgradeTower.upgradeFireSpeed();
                    totalCurrency -= towerCosts["standard"].fireSpeedCost;
                }
                break;

            case "Poisoner":
                if (totalCurrency >= towerCosts["poisoner"].fireSpeedCost) {
                    selectedUpgradeTower.upgradeFireSpeed();
                    totalCurrency -= towerCosts["poisoner"].fireSpeedCost;
                }
                break;

            case "Freezer":
                if (totalCurrency >= towerCosts["freezer"].fireSpeedCost) {
                    selectedUpgradeTower.upgradeFireSpeed();
                    totalCurrency -= towerCosts["freezer"].fireSpeedCost;
                }
                break;
        }
    });

    uiHandler.nextLevelButton.mousePressed(function () {
        switchMap();
        saveGame();
    });
    uiHandler.returnToMenuButton.mousePressed(function() {
        location.reload();
    });

    //Poll for bullets every 100ms
    setInterval(fireBullets, 100);
    setInterval(dealDamage, 100);
}

// ---------------------------------------------------------------------
// GAME LOOP
// ---------------------------------------------------------------------

window.draw = function () {
    
    fill(0);

    currentLevelMusic.setVolume(uiHandler.audioSlider.value());

    if (gameMode == 0) {
        uiHandler.updateUIForGameMode(gameMode);
        uiHandler.nextLevelButton.hide();
        
        if (!playTitleScreenMusic) {
            titleScreenMusic.loop();
            playTitleScreenMusic = true;
        }


        if (!localStorage.getItem("saveState")) {
            uiHandler.loadButton.hide();
        }

        // Switch to game mode
        if (beginGame) {
            gameMode = 1;
            titleScreenMusic.pause();
            if (localStorage.getItem("mute")) {
                if (localStorage.getItem("mute") == "true") {
                    currentLevelMusic.pause();
                    playSound = false;
                    uiHandler.muteButton.html('volume_off');
                }
            }
        }
    }
    if (gameMode == 1) {

        uiHandler.updateUIForGameMode(gameMode);
        uiHandler.updateToolbarState(totalCurrency, getSelectedTower(), towerCosts);

        // TODO
        // if (nextWaveCheck.amount < 1) uiHandler.nextWaveButton.show();
        // else uiHandler.nextWaveButton.hide();

        background(200);
        image(mapImg, WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2, WINDOW_WIDTH, WINDOW_HEIGHT);

        // Displays Level Complete Text and button when all waves are done
        uiHandler.nextLevelButton.hide();
        if (!uiHandler.settingsOpen && !uiHandler.encyclopediaOpen) {
            if (levelComplete) {
                push();
                textAlign(CENTER);
                textSize(40)
                fill('red');
                var lev = mapID + 1
                stroke(0);
                strokeWeight(4);
                if (lev == 3) {
                    text('Capt. DeLozier Defeated!', 600, 100);
                }
                else {
                    text('Level ' + lev + ' Complete', 600, 100);
                }
                pop();
                if (lev < 3) {
                    saveGame();
                    uiHandler.nextLevelButton.show(); 
                }
                else {
                    // Return to main Menu Button
                    uiHandler.returnToMenuButton.show();
                }
            }

            if (towerToPlace) {
                push();
                switch(towerToPlace.constructor.name) {
                    case "Standard":
                        if (MAPS[0].isColliding(mouseX, 30) || totalCurrency < 400) {
                            tint(255, 0, 0, 200);
                        } else {
                            tint(255, 200);
                        }
                        image(towerSprite, mouseX, mouseY, Tower.TOWER_SIZE, Tower.TOWER_SIZE);
                        break;
                    case "Freezer":
                        if (MAPS[0].isColliding(mouseX, 30) || totalCurrency < 50) {
                            tint(255, 0, 0, 200);
                        } else {
                            tint(255, 200);
                        }
                        image(freezerTowerSprite, mouseX, mouseY, Tower.TOWER_SIZE, Tower.TOWER_SIZE);
                        break;
                    case "Poisoner":
                        if (MAPS[0].isColliding(mouseX, 30) || totalCurrency < 10) {
                            tint(255, 0, 0, 200);
                        } else {
                            tint(255, 200);
                        }
                        image(poisonerTowerSprite, mouseX, mouseY, Tower.TOWER_SIZE, Tower.TOWER_SIZE);
                        break;
                }
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
                switch(t.type) {
                    case "standard":
                        t.draw(towerSprite);
                        break;
                    case "freezer":
                        t.draw(freezerTowerSprite);
                        break;
                    case "poisoner":
                        t.draw(poisonerTowerSprite);
                        break;
                    default:
                        t.draw(towerSprite);
                        break;
                }
                if (t.isStunned()) t.drawStunned();
            }

            // Handle waves automatically, not needed for tutorial
            if (nextWaveCheck.amount < 1 && mapID != 3) {
                if (currentWave == 0) {
                    push();
                    textSize(20);
                    fill('white');
                    stroke(0);
                    strokeWeight(4);
                    text("Game starts in: " + initNextWave, WINDOW_WIDTH - 200, WINDOW_HEIGHT - 50);
                    pop();
                }
                else if (currentWave < waveAmount) {
                    push();
                    textSize(20);
                    fill('white');
                    stroke(0);
                    strokeWeight(4);
                    text("Next wave in: " + initNextWave, WINDOW_WIDTH - 185, WINDOW_HEIGHT - 50);
                    pop();
                }
                else {
                    levelComplete = true;
                }
                if (frameCount % 60 == 0 && initNextWave > 0) initNextWave--;
                if (initNextWave == 0) {
                    if (currentWave < waveAmount) spawnNextWave();
                    initNextWave = 5;
                }
            }
            //console.log(initNextWave);
            // uiHandler.nextWaveButton.show();
            // else uiHandler.nextWaveButton.hide();

            // draw currency holder
            push();
            image(coinSprite, 90, 35, 20, 20);
            textSize(20);
            fill('white');
            stroke(0);
            strokeWeight(4);
            text(totalCurrency, 105, 40);
            pop();

            // draw current health
            push();
            image(healthSprite, 25, 35, 20, 20);
            textSize(20);
            fill('white');
            stroke(0);
            strokeWeight(4);
            text(totalHealth, 40, 40);
            pop();

            if (totalHealth <= 0) {
                gameMode = -1;
                gameOver = true;
            }

            // draw Wave information
            if(mapID != 3) {
                push();
                textSize(20);
                fill('white');
                stroke(0);
                strokeWeight(4);
                text('Wave: ' + currentWave + '/' + LEVELS[mapID].LEVEL_DATA.length, WINDOW_WIDTH - 120, WINDOW_HEIGHT - 25);
                pop();
            }

            // inject the tutorial
            if (mapID == 3) {
                tutorialHandler();
            } else {
                uiHandler.tutorialContainer.hide();
            }

            // draw or remove enemies
            // iterate backwards to prevent flickering
            for (let i = enemies.length - 1; i >= 0; i--) {
                enemies[i].checkStatus();

                if(mapID == 3){
                    if(enemies[i].health > 1){ enemies[i].health = 1; }
                }

                if (enemies[i].hasReachedEnd()) {
                    totalHealth -= enemies[i].damage;
                    nextWaveCheck.amount -= 1;

                    // Implement game over screen if needed
                    enemies.splice(i, 1);
                } else if (enemies[i].health <= 0) {
                    totalCurrency += enemies[i].currency;
                    // handle spawner type enemies

                    // Mark an enemy as dead if its health is below 0
                    if (enemies[i].isDead() == false) {
                        enemies[i].kill();

                        switch (enemies[i].appearance) {
                            case "standard":
                                if(playSound) { enemyDeathSound_zombie.play(); }
                                break;
                            case "spawner":
                                if(playSound) { enemyDeathSound_summoner.play(); }
                                break;
                            case "rapid":
                                if(playSound) { enemyDeathSound_squid.play(); }
                                break;
                            default:
                                if(playSound) { enemyDeathSound_default.play(); }
                                break;
                        }
                    }

                    if (enemies[i].spawn) {
                        enemies[i].spawn(enemies, nextWaveCheck);
                    }
                    nextWaveCheck.amount -= 1;
                    enemies.splice(i, 1);
                } else {
                    switch (enemies[i].appearance) {
                        case "standard":
                            enemies[i].draw(basicEnemy);
                            break;
                        case "spawner":
                            enemies[i].draw(summonerEnemy);
                            break;
                        case "rapid":
                            enemies[i].draw(summoneeEnemy);
                            break;
                        case "tank":
                            enemies[i].draw(tankEnemy);
                            break;
                        case "boss":
                            enemies[i].draw(bossEnemy);
                            break;
                        default:
                            enemies[i].drawBasic();
                            break;
                    }

                    // handle stunner type enemies
                    if (enemies[i].stunTower) {
                        if (stunCooldown.amount < stunCooldown.trigger) stunCooldown.amount++;
                        else {
                            let n = towers.length;
                            let stunIndex = enemies[i].stunTower(n);
                            if (stunIndex != -1) {
                                while (stunIndex < n && towers[stunIndex].isStunned()) {
                                    stunIndex++
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
                    if (bullets[i].freeze) {
                        if (bullets[i].target.unFreeze == -1) {
                            bullets[i].target.speed /= 2;
                        } 
                        bullets[i].target.unFreeze = bullets[i].target.x + 300 * bullets[i].target.speed;
                    
                        
                    }
                    if (bullets[i].poison) {
                        bullets[i].target.unPoison = bullets[i].target.x + 300 * bullets[i].target.speed;
                    }
                    bullets.splice(i, 1);
                } else {
                    bullets[i].draw();
                }
            }
        }
    }

    if (gameMode == -1 && gameOver == true) {

        uiHandler.updateUIForGameMode(gameMode);

        game.hide();

        if (currentLevelMusic.isPlaying()) {
            currentLevelMusic.pause();
            deathSound.play();
        }
    }
}

function saveGame() {
    // Save game state
    let saveState = {
        mapID: mapID,
        nextWaveCheck: nextWaveCheck.amount,
        levelComplete: levelComplete,
        totalCurrency: totalCurrency,
        totalHealth: totalHealth,
        waveAmount: waveAmount,
        currentWave: currentWave,
        towers: towers,
        bullets: bullets,
        enemies: enemies
    };
    localStorage.setItem("saveState", JSON.stringify(saveState));

}

// ---------------------------------------------------------------------
// SAVE AND LOAD
// ---------------------------------------------------------------------

function loadGame() {
    let saveState = JSON.parse(localStorage.getItem("saveState"));

    mapID = saveState.mapID;
    levelComplete = saveState.levelComplete;
    totalCurrency = saveState.totalCurrency;
    totalHealth = saveState.totalHealth;
    waveAmount = saveState.waveAmount;
    if (saveState.currentWave == 0) {
        currentWave = saveState.currentWave;
    }
    else {
        currentWave = saveState.currentWave - 1;
    }

    if (saveState) {

        // Load Towers
        let towerData = JSON.parse(localStorage.getItem("saveState")).towers;
        for (let i = 0; i < towerData.length; i++) {
            let t;
            switch (towerData[i].type) {
                case "standard":
                    t = new Standard(towerData[i].x, towerData[i].y);
                    break;
                case "freezer":
                    t = new Freezer(towerData[i].x, towerData[i].y);
                    break;
                case "poisoner":
                    t = new Poisoner(towerData[i].x, towerData[i].y);
                    break;
                default:
                    t = new Tower(towerData[i].x, towerData[i].y);
                    break;
            }
            t.range = towerData[i].range;
            t.damage = towerData[i].damage;
            t.health = towerData[i].health;
            t.fireRate = towerData[i].fireRate;
            t.coolDown = towerData[i].coolDown;
            t.fireSpeed = towerData[i].fireSpeed;

            towers.push(t);
        }

        currentLevelMusic.stop();
        selectMap(mapID);
        currentLevelMusic.loop();
        redraw();
    }
}

function tutorialHandler() {
    switch(tutorialTask) {
        case 0:
            uiHandler.tutorialNextButton.show();
            uiHandler.placeStandardButton.hide();
            uiHandler.placeFreezerButton.hide();
            uiHandler.placePoisonerButton.hide();
            uiHandler.updateTutorial('<h1>Welcome to the Galatic Guardians Tutorial!</h1><p>The objective of the game is to place towers along the path to defeat all of the enemies.</p>', 400, 250, 135);
            // Advancement handled in mousePressed
            break;
        case 1:
            uiHandler.updateTutorial('<h1>Let\'s start by placing a tower.</h1><p>Click on the Standard Tower button to place a tower.</p>', 400, 250, 135);
            uiHandler.placeStandardButton.show();
            uiHandler.placeFreezerButton.show();
            uiHandler.placePoisonerButton.show();
            if(towerToPlace) { tutorialTask++; }
            break;
        case 2:
            uiHandler.updateTutorial('<h1>Now place the tower on the map.</h1><p>Click on the map to place the tower. <br>Try to place your towers close to the path.</p>', 400, 250, 135);
            if(towers.length > 0) { tutorialTask++; }
            break;
        case 3:
            uiHandler.updateTutorial('<h1>Great! Now let\'s upgrade the tower.</h1><p>Click on the tower to upgrade it.<br>When playing make sure to watch your currency in the top left.</p>', 400, 250, 135);
            task3Currency = totalCurrency;
            if(getSelectedTower()) { tutorialTask++; }
            break;
        case 4:
            uiHandler.updateTutorial('<h1>Now upgrade the tower\'s fire rate.</h1><p>Click on the range fire rate button.</p><br>Upgrades allow you to increase the power of your tower.', 400, 250, 135);
            if(totalCurrency < task3Currency) { tutorialTask++; }
            break;
        case 5:
            uiHandler.updateTutorial('<h1>Looks like some enemies are coming!</h1><p>Lets see how you did.</p>', 400, 250, 135);
            spawnNextWave();
            waitBeforeNextTask++;
            if(enemies.length == 0 && waitBeforeNextTask >= 500) { tutorialTask++; }
            break;
        case 6:
            uiHandler.tutorialNextButton.show();
            uiHandler.updateTutorial('<h1>Great job!</h1><p>Now you are ready to play the game! Click next to begin.</p>', 400, 250, 135);
            break;

    }
}

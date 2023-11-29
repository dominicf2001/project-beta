/** @module ui-handler */

export class UIHandler {
    constructor(windowWidth, windowHeight) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        // STATE VARIABLES
        this.settingsOpen = false;
        this.encyclopediaOpen = false;
        this.ignoreNextClick = false;
        this.placeTowerButtonSelected = false;
        this.mapMenuOpen = false;

        this.audioLevel;
        
        // UI IMAGE VARIABLES
        this.titleImg;
        this.gameOverScreen;
        this.startButton;
        this.loadButton;
        this.launchTutorialButton;
        //this.nextWaveButton;
        this.muteButton;
        this.placeStandardButton;
        this.placeFreezerButton;
        this.placePoisonorButton;
        this.upgradeContainer;
        this.upgradeRangeButton;
        this.upgradeFireRateButton;
        this.upgradeFireSpeedButton;
        this.debugConsole;
        this.returnToMenuButton;
        

        // SETTINGS
        this.settingsButton;
        this.settingsWindow;
        this.returnToGame;
        this.saveButton;
        this.gameExit;
        this.muteButton;
        this.audioSlider;
        this.saveText;

        this.encyclopediaMenu;
        this.encyclopediaButton;

        this.tutorialContainer;
        this.tutorialNextButton;
        this.tutorialTask = 0;

        // image variables
        this.enemyStandard;
        this.enemySummoner;
        this.enemySummonee;
        this.spaceWalkMap;
        this.spaceshipMap;
        this.bossMap;

        // Map Menu
        this.mapSelectButton;
        this.mapMenu;
        this.mapExit;
        this.level1Button;
        this.level2Button;
        this.level3Button;
    }

    preloadAssets() {
        this.titleImg = loadImage('./assets/Title Screen 2-1.png');
        this.enemyStandard = loadImage('./assets/Basic_Enemy.png');
        this.enemySummoner = loadImage('./assets/Summoner.png');
        this.enemySummonee = loadImage('./assets/Summonee.png');
        this.spaceWalkMap = loadImage('./Maps/Space Map 1.png');
        this.spaceshipMap = loadImage('./Maps/Space Ship Map.png');
        this.bossMap = loadImage('./assets/RainbowRoad Question Mark.png');
    }

    initializeUI() {
        imageMode(CENTER);
        
        image(this.titleImg, this.windowWidth / 2, (this.windowHeight / 2), this.windowWidth, this.windowHeight);

        this.#initializeToolbar();

        /*this.#initializeLoadAndSave();*/

        this.#initializeMapMenu();

        this.#initializeTutorial();

        this.#initializeEncyclopedia();

        this.#initializeSettings();

        this.#initializeDebugConsole();

        this.gameOverScreen = createImg('./assets/Game_OVER_Screen.png');
        this.gameOverScreen.addClass('gameOver');

        this.startButton = createImg('./assets/GalacticGuardiansStartBtn.png');
        this.startButton.addClass('startButton');
        this.startButton.position(this.windowWidth - 325, this.windowHeight - 250);
        this.startButton.size(200, 80);

        this.loadButton = createButton('Load Save');
        this.loadButton.addClass('ui_buttons');
        this.loadButton.size(200, 40);
        this.loadButton.position(this.windowWidth - 325, this.windowHeight - 115);

        this.mapSelectButton = createButton('Select Map');
        this.mapSelectButton.addClass('ui_buttons');
        this.mapSelectButton.size(200, 40);
        this.mapSelectButton.position(this.windowWidth - 325, this.windowHeight - 165);
        this.mapSelectButton.mousePressed(() =>
            this.#showMaps()
        );
        this.mapExit.mousePressed(() =>
            this.#hideMaps()
        );
        
        this.launchTutorialButton = createButton('Launch Tutorial');
        this.launchTutorialButton.addClass('ui_buttons');
        this.launchTutorialButton.size(200, 40);
        this.launchTutorialButton.position(this.windowWidth - 325, this.windowHeight - 65);
        
        /*
        this.level1Button.mousePressed(() =>
            this.#loadLevel1()
        );
        */
        this.returnToMenuButton = createButton('Return to Main Menu');
        this.returnToMenuButton.addClass('ui_buttons');
        this.returnToMenuButton.size(300, 40);
        this.returnToMenuButton.position(this.windowWidth - 325, this.windowHeight - 165);

        // draw "next wave" button
        // this.nextWaveButton = createButton('Next Wave')
        // this.nextWaveButton.position(this.windowWidth - 100, this.windowHeight + 15);
        // this.nextWaveButton.mousePressed(() =>
        //     this.onNextWaveClick()
        // );

        // draw Next Level Button
        this.nextLevelButton = createButton('Next Level');
        this.nextLevelButton.id('nextLevelButton');
        this.nextLevelButton.addClass('ui_buttons');
        this.nextLevelButton.position(this.windowWidth - 130, this.windowHeight - 100);
        this.nextLevelButton.size(120, 40);

        this.settingsButton = createSpan('settings');
        this.settingsButton.id('settingsButton');
        this.settingsButton.addClass('material-symbols-outlined');
        this.settingsButton.position(this.windowWidth - 50, 10);
        this.settingsButton.size(40, 40);

        this.toggleCoinsIncrease = createButton("Increase Currency");
        this.toggleCoinsIncrease.id("toggleCoinsIncrease");
        this.toggleCoinsIncrease.position(this.windowWidth - 250, this.windowHeight + 45);


        this.toggleCoinsDecrease = createButton("Decrease Currency");
        this.toggleCoinsDecrease.id("toggleCoinsDecrease");
        this.toggleCoinsDecrease.position(this.windowWidth - 400, this.windowHeight + 45);


        this.toggleHealthIncrease = createButton("Increase Health");
        this.toggleHealthIncrease.id("toggleHealthIncrease");
        this.toggleHealthIncrease.position(this.windowWidth - 550, this.windowHeight + 45);


        this.toggleHealthDecrease = createButton("Decrease Health");
        this.toggleHealthDecrease.id("toggleHealthDecrease");
        this.toggleHealthDecrease.position(this.windowWidth - 700, this.windowHeight + 45);

        this.encyclopediaButton = createButton('Encyclopedia');
        this.encyclopediaButton.addClass('ui_buttons');
        this.encyclopediaButton.position(this.windowWidth - 279, 10);
        this.encyclopediaButton.size(219, 40);
        this.encyclopediaButton.mousePressed(() =>
            this.#showEncyclopedia()
        );
        this.encyclopediaExit.mousePressed(() =>
            this.#hideEncyclopedia()
        );
    }

    #initializeToolbar() {
        const toolBar = createDiv();
        toolBar.addClass('toolbar');
        toolBar.position(10, this.windowHeight - 65);

        // const towerImg = createImg("./assets/RedMoonTower.png");
        this.placeStandardButton = createButton();
        this.placeStandardButton.addClass('ui_buttons');
        this.placeStandardButton.addClass('toolbar_buttons');
        this.placeStandardButton.addClass('place_tower_button');
        this.placeStandardButton.id('place_standard_button');
        toolBar.child(this.placeStandardButton);

        // const towerImg = createImg("./assets/RedMoonTower.png");
        this.placePoisonerButton = createButton();
        this.placePoisonerButton.addClass('ui_buttons');
        this.placePoisonerButton.addClass('toolbar_buttons');
        this.placePoisonerButton.addClass('place_tower_button');
        this.placePoisonerButton.id('place_poisoner_button');
        toolBar.child(this.placePoisonerButton);

        // const towerImg = createImg("./assets/RedMoonTower.png");
        this.placeFreezerButton = createButton();
        this.placeFreezerButton.addClass('ui_buttons');
        this.placeFreezerButton.addClass('toolbar_buttons');
        this.placeFreezerButton.addClass('place_tower_button');
        this.placeFreezerButton.id('place_freezer_button');
        toolBar.child(this.placeFreezerButton);

        this.upgradeContainer = createDiv();
        this.upgradeContainer.addClass('toolbar_upgrades');
        //toolBar.child(this.upgradeContainer);

        const upgradeText = createP('Upgrades');
        upgradeText.addClass('toolbar_title');
        this.upgradeContainer.child(upgradeText);

        this.upgradeRangeButton = createButton('Range');
        this.upgradeRangeButton.addClass('ui_buttons');
        this.upgradeRangeButton.addClass('toolbar_buttons');
        this.upgradeContainer.child(this.upgradeRangeButton);

        this.upgradeFireRateButton = createButton('Fire Rate')
        this.upgradeFireRateButton.addClass('ui_buttons');
        this.upgradeFireRateButton.addClass('toolbar_buttons');
        this.upgradeContainer.child(this.upgradeFireRateButton);

        this.upgradeFireSpeedButton = createButton('Bullet Speed');
        this.upgradeFireSpeedButton.addClass('ui_buttons');
        this.upgradeFireSpeedButton.addClass('toolbar_buttons');
        this.upgradeContainer.child(this.upgradeFireSpeedButton);

        push();
        const toolbarColor = color(51, 51, 51);
        toolbarColor.setAlpha(200);

        fill(toolbarColor);
        noStroke();
        rect(0, this.windowHeight, this.windowWidth, 50);
        pop();
    }

    /*
    #initializeLoadAndSave() {
        this.saveButton = createButton('Save');
        this.saveButton.id('saveButton');
        this.saveButton.addClass('ui_buttons');
        this.saveButton.size(100, 40);
        this.saveButton.position(this.windowWidth - 390, 10);
    }*/


    #initializeTutorial() {
        this.tutorialContainer = createDiv();
        this.tutorialContainer.id('tutorialContainer');
        this.tutorialContainer.addClass("encyclopedia");
        this.tutorialContainer.style("display:block;");

        this.tutorialNextButton = createButton('Next');
        this.tutorialNextButton.addClass('ui_buttons');
        this.tutorialNextButton.size(100, 40);
        this.tutorialNextButton.position(420, 350);
        this.tutorialNextButton.hide();

    }

    /* Possible idea:
    Have rectangles over enemy info. If enemy appears on screen then remove rectangle 
    to reveal info.
    */
    #initializeEncyclopedia() {
        // container
        this.encyclopediaMenu = createGraphics(this.windowWidth - 200, this.windowHeight - 100);
        this.encyclopediaMenu.addClass("encyclopedia");
        this.encyclopediaMenu.style("display:block;");

        // exit button
        this.encyclopediaExit = createButton('X');
        this.encyclopediaExit.addClass('encyclopedia-exit');
        this.encyclopediaExit.position(this.windowWidth - 145, 60);
        this.encyclopediaMenu.textSize(15);

        // STANDARD ENEMY CARD
        this.encyclopediaMenu.image(this.enemyStandard, 35, 30, 200, 250);
        // title
        this.encyclopediaMenu.textSize(17);
        this.encyclopediaMenu.stroke(1);
        this.encyclopediaMenu.strokeWeight(1);
        this.encyclopediaMenu.text("Void Crawler", 250, 50, 200, 250);
        //description
        this.encyclopediaMenu.textSize(15);
        this.encyclopediaMenu.stroke(0);
        this.encyclopediaMenu.strokeWeight(0);
        this.encyclopediaMenu.text("This enemy is a creepy, rotting astronaut who's come back from the dead in the darkest corners of the universe, and it wants to nibble on your space snacks!", 250, 80, 200, 250);
        // stats
        this.encyclopediaMenu.textSize(15);
        this.encyclopediaMenu.stroke(1);
        this.encyclopediaMenu.strokeWeight(1);
        this.encyclopediaMenu.text("Damage: 3", 250, 210, 200, 250);

        // SUMMONER ENEMY CARD
        this.encyclopediaMenu.image(this.enemySummoner, 35, 310, 200, 250);
        // title
        this.encyclopediaMenu.textSize(17);
        this.encyclopediaMenu.stroke(1);
        this.encyclopediaMenu.strokeWeight(1);
        this.encyclopediaMenu.text("Cosmic Conjuror", 250, 320, 200, 250);
        // description
        this.encyclopediaMenu.textSize(15);
        this.encyclopediaMenu.stroke(0);
        this.encyclopediaMenu.strokeWeight(0);
        this.encyclopediaMenu.text("The alien summoner is a mysterious foe wielding otherworldly powers, conjuring strange and formidable creatures to do its bidding in intergalactic battles.", 250, 350, 200, 250);
        // stats
        this.encyclopediaMenu.textSize(15);
        this.encyclopediaMenu.stroke(1);
        this.encyclopediaMenu.strokeWeight(1);
        this.encyclopediaMenu.text("Damage: 1", 250, 500, 200, 250);

        // enemy info #3
        //this.encyclopediaMenu.image(this.enemySummoner, 525, 30, 200, 250);
        //this.encyclopediaMenu.text("Tank", 750, 50, 200, 250);
        //this.encyclopediaMenu.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", 750, 80, 200, 250);
        //this.encyclopediaMenu.text("Damage: 1", 750, 210, 200, 250);

        // SUMMONEE ENEMY CARD
        this.encyclopediaMenu.image(this.enemySummonee, 525, 310, 200, 250);
        // title
        this.encyclopediaMenu.textSize(17);
        this.encyclopediaMenu.stroke(1);
        this.encyclopediaMenu.strokeWeight(1);
        this.encyclopediaMenu.text("Astrocephalopod", 750, 320, 200, 250);
        // description
        this.encyclopediaMenu.textSize(15);
        this.encyclopediaMenu.stroke(0);
        this.encyclopediaMenu.strokeWeight(0);
        this.encyclopediaMenu.text("A tentacled extraterrestrial monstrosity summoned from the depths of space, this enemy uses its otherworldly appendages to ensnare and confound its adversaries in intergalactic encounters.", 750, 350, 200, 250);
        // stats
        this.encyclopediaMenu.textSize(15);
        this.encyclopediaMenu.stroke(1);
        this.encyclopediaMenu.strokeWeight(1);
        this.encyclopediaMenu.text("Damage: 1", 750, 500, 200, 250);


        this.encyclopediaMenu.hide();
        this.encyclopediaExit.hide();
    }
    #initializeMapMenu() {
        // container
        this.mapMenu = createGraphics(this.windowWidth - 600, this.windowHeight - 100);
        this.mapMenu.addClass("mapMenu");
        this.mapMenu.style("display:block;");

        // exit button
        this.mapExit = createButton('X');
        this.mapExit.addClass('encyclopedia-exit');
        this.mapExit.position(this.windowWidth - 350, 60);
        this.mapMenu.textSize(15);

        // Level 1 Button
        this.mapMenu.image(this.spaceWalkMap, 35, 60, 200, 150);
        this.level1Button = createButton('Space Walk Map');
        this.level1Button.addClass('mapMenuButton');
        this.level1Button.position(this.windowWidth - 650, 160);
        this.level1Button.size(219, 40);
        // Level 2 Button
        this.mapMenu.image(this.spaceshipMap, 35, 230, 200, 150);
        this.level2Button = createButton('Space Ship Map');
        this.level2Button.addClass('mapMenuButton');
        this.level2Button.position(this.windowWidth - 650, 345);
        this.level2Button.size(219, 40);
        // Level 3 Button
        this.mapMenu.image(this.bossMap, 35, 400, 200, 150);
        this.level3Button = createButton('Boss Map');
        this.level3Button.addClass('mapMenuButton');
        this.level3Button.position(this.windowWidth - 650, 500);
        this.level3Button.size(219, 40);

        this.mapMenu.textSize(30);
        this.mapMenu.fill('blue');
        this.mapMenu.stroke(1);
        this.mapMenu.strokeWeight(1);
        this.mapMenu.text("<-- Select a Map -->", 180, 20, 300, 250);

        this.mapMenu.hide();
        this.mapExit.hide();
        this.level1Button.hide();
        this.level2Button.hide();
        this.level3Button.hide();
    }
    #showMaps() {
        if (!this.mapMenuOpen) {
            this.mapMenu.show();
            this.mapExit.show();
            this.level1Button.show();
            this.level2Button.show();
            this.level3Button.show();
            this.mapMenuOpen = true;
        }
    }
    #hideMaps() {
        if (this.mapMenuOpen) {
            this.ignoreNextClick = true;
            this.mapMenu.hide();
            this.mapExit.hide();
            this.level1Button.hide();
            this.level2Button.hide();
            this.level3Button.hide();
            this.mapMenuOpen = false;
        }
    }

    #initializeSettings() {
        this.settingsWindow = createGraphics(350, 375);
        this.settingsWindow.addClass("settings");
        this.settingsWindow.style("display:block;");

        this.returnToGame = createButton('Return To Game');
        this.returnToGame.id('returnToGame');
        this.returnToGame.addClass('ui_buttons');
        this.returnToGame.size(200, 70);
        this.returnToGame.position(this.windowWidth / 2 - 100, 200);
        this.returnToGame.mousePressed(() =>
            this.toggleSettings()
        );

        this.saveButton = createButton('Save');
        this.saveButton.id('saveButton');
        this.saveButton.addClass('ui_buttons');
        this.saveButton.size(200, 70);
        this.saveButton.position(this.windowWidth / 2 - 100, 280);

        this.gameExit = createButton('Main Menu');
        this.gameExit.addClass('ui_buttons');
        this.gameExit.size(200, 70);
        this.gameExit.position(this.windowWidth / 2 - 100, 360);

        this.muteButton = createSpan('volume_up');
        this.muteButton.id('audioButton');
        this.muteButton.addClass('material-symbols-outlined');
        this.muteButton.size(75, 50);
        this.muteButton.position(this.windowWidth / 2 - 100, 450);

        this.audioSlider = createGraphics(this.windowWidth - 200, this.windowHeight - 100);
        this.audioSlider = createSlider(0, 1, 1, 0);
        this.audioSlider.addClass('audioSlider');
        this.audioSlider.position(this.windowWidth / 2, 465);
        this.audioSlider.style('width', '100px');

    }

    updateUIForGameMode(gameMode) {
        if (gameMode === -1) {
            this.returnToMenuButton.show();
            this.gameOverScreen.show();
            this.upgradeRangeButton.hide();
            this.upgradeContainer.hide();
            this.upgradeFireRateButton.hide();
            this.upgradeFireSpeedButton.hide();
            this.placeStandardButton.hide();
            this.placeFreezerButton.hide();
            this.placePoisonerButton.hide();
            this.saveButton.hide();
            //this.mapSelectButton.hide();
            // this.nextWaveButton.hide();
            this.settingsButton.hide();
            this.muteButton.hide();
            this.nextLevelButton.hide();
            this.toggleCoinsIncrease.hide();
            this.toggleCoinsDecrease.hide();
            this.toggleHealthIncrease.hide();
            this.toggleHealthDecrease.hide();

        } else if (gameMode === 0) {
            image(this.titleImg, this.windowWidth / 2, (this.windowHeight / 2), this.windowWidth, this.windowHeight);
            this.startButton.show();
            this.loadButton.show();
            this.mapSelectButton.show();
            this.upgradeContainer.hide();
            this.upgradeRangeButton.hide();
            this.upgradeFireRateButton.hide();
            this.upgradeFireSpeedButton.hide();
            this.placeStandardButton.hide();
            this.placeFreezerButton.hide();
            this.placePoisonerButton.hide();
            this.saveButton.hide();
            this.mapSelectButton.show();
            this.loadButton.show();
            this.startButton.show();
            // this.nextWaveButton.hide();
            this.gameOverScreen.hide();
            this.settingsButton.hide();
            this.nextLevelButton.hide();
            this.toggleCoinsIncrease.hide();
            this.toggleCoinsDecrease.hide();
            this.toggleHealthIncrease.hide();
            this.toggleHealthDecrease.hide();
            this.encyclopediaButton.hide();
            this.returnToMenuButton.hide();

            // SETTINGS
            this.settingsWindow.hide();
            this.returnToGame.hide();
            this.saveButton.hide();
            this.gameExit.hide();
            this.muteButton.hide();
            this.audioSlider.hide();

        } else if (gameMode === 1) {
            this.upgradeContainer.show();
            this.placeStandardButton.show();
            this.placeFreezerButton.show();
            this.placePoisonerButton.show();
            this.upgradeRangeButton.show();
            this.upgradeFireRateButton.show();
            this.upgradeFireSpeedButton.show();
            this.toggleCoinsIncrease.show();
            this.toggleCoinsDecrease.show();
            this.toggleHealthIncrease.show();
            this.toggleHealthDecrease.show();
            this.startButton.hide();
            this.loadButton.hide();
            this.launchTutorialButton.hide();
            this.mapSelectButton.hide();
            this.mapMenu.hide();
            this.mapExit.hide();
            this.level1Button.hide();
            this.level2Button.hide();
            this.level3Button.hide();
            this.returnToMenuButton.hide();
            // this.nextWaveButton.show();
            this.nextLevelButton.show();
            this.gameOverScreen.hide();
            this.encyclopediaButton.show();
            this.settingsButton.show();
        }
    }

    updateToolbarState(totalCurrency, selectedTower, towerCosts) {
        if (selectedTower) {
            this.upgradeContainer.show();

            if (selectedTower.y > this.windowHeight - 200) {
                this.upgradeContainer.position(selectedTower.x - 75, selectedTower.y - 160);
            } else {
                this.upgradeContainer.position(selectedTower.x - 75, selectedTower.y + 80);
            }
            this.upgradeFireRateButton.show();
            this.upgradeRangeButton.show();
            this.upgradeFireSpeedButton.show();
        } else {
            this.upgradeContainer.hide();
            this.upgradeFireRateButton.hide();
            this.upgradeRangeButton.hide();
            this.upgradeFireSpeedButton.hide();
        }

        // PLACE STANDARD TOWER
        if (totalCurrency < towerCosts["standard"]["placeTowerCost"]) {
            this.placeStandardButton.style('color', color(181, 43, 131, 100));
            this.placeStandardButton.style('background-color', color(81, 176, 101, 50));
        } else {
            this.placeStandardButton.style('color', color(181, 43, 131));
            this.placeStandardButton.style('background-color', color(81, 176, 101));
        }
        this.placeStandardButton.html(`Place Standard (${towerCosts["standard"]["placeTowerCost"]})`);

        // PLACE FREEZER TOWER
        if (totalCurrency < towerCosts["freezer"]["placeTowerCost"]) {
            this.placeFreezerButton.style('color', color(181, 43, 131, 100));
            this.placeFreezerButton.style('background-color', color(81, 176, 101, 50));
        } else {
            this.placeFreezerButton.style('color', color(181, 43, 131));
            this.placeFreezerButton.style('background-color', color(81, 176, 101));
        }
        this.placeFreezerButton.html(`Place Freezer (${towerCosts["freezer"]["placeTowerCost"]})`);

        // PLACE POISON TOWER
        if (totalCurrency < towerCosts["poisoner"]["placeTowerCost"]) {
            this.placePoisonerButton.style('color', color(181, 43, 131, 100));
            this.placePoisonerButton.style('background-color', color(81, 176, 101, 50));
        } else {
            this.placePoisonerButton.style('color', color(181, 43, 131));
            this.placePoisonerButton.style('background-color', color(81, 176, 101));
        }
        this.placePoisonerButton.html(`Place Poisoner (${towerCosts["poisoner"]["placeTowerCost"]})`);

        if (totalCurrency < selectedTower?.fireRateCost) {
            this.upgradeFireRateButton.style('color', color(181, 43, 131, 100));
            this.upgradeFireRateButton.style('background-color', color(81, 176, 101, 50));
        } else {
            this.upgradeFireRateButton.style('color', color(181, 43, 131));
            this.upgradeFireRateButton.style('background-color', color(81, 176, 101));
        }
        this.upgradeFireRateButton.html(`Fire rate (${selectedTower?.fireRateCost})`);

        if (totalCurrency < selectedTower?.fireSpeedCost) {
            this.upgradeFireSpeedButton.style('color', color(181, 43, 131, 100));
            this.upgradeFireSpeedButton.style('background-color', color(81, 176, 101, 50));
        } else {
            this.upgradeFireSpeedButton.style('color', color(181, 43, 131));
            this.upgradeFireSpeedButton.style('background-color', color(81, 176, 101));
        }
        this.upgradeFireSpeedButton.html(`Bullet speed (${selectedTower?.fireSpeedCost})`);

        if (totalCurrency < selectedTower?.rangeCost) {
            this.upgradeRangeButton.style('color', color(181, 43, 131, 100));
            this.upgradeRangeButton.style('background-color', color(81, 176, 101, 50));
        } else {
            this.upgradeRangeButton.style('color', color(181, 43, 131));
            this.upgradeRangeButton.style('background-color', color(81, 176, 101));
        }
        this.upgradeRangeButton.html(`Range (${selectedTower?.rangeCost})`);
    }

    /*
    handleEscapeKeyPress() {
        if (!this.encyclopediaOpen)
            openSettings();
        if (this.encyclopediaOpen) {
            this.encyclopedia.hide();
            this.encyclopediaExit.hide();
            this.encyclopediaOpen = false;
        }
    }
    */

    toggleSettings() {
        if (!this.settingsOpen) {
            this.settingsWindow.show();
            this.returnToGame.show();
            this.saveButton.show();
            this.gameExit.show();
            this.muteButton.show();
            this.audioSlider.show();
            this.settingsOpen = true;
        } else {
            this.settingsWindow.hide();
            this.returnToGame.hide();
            this.saveButton.hide();
            this.gameExit.hide();
            this.muteButton.hide();
            this.audioSlider.hide();
            this.settingsOpen = false;
        }
    }

    #showEncyclopedia() {
        if (!this.encyclopediaOpen) {
            this.encyclopediaMenu.show();
            this.encyclopediaExit.show();
            this.encyclopediaOpen = true;
        }
    }

    updateTutorial(html, x, y, height) {
        let tutorialContainer = select('#tutorialContainer');
        tutorialContainer.show();
        tutorialContainer.html(html + '<br><br><br>');
        tutorialContainer.position(x, y);
    }

    closeTutorial() {
        this.tutorialContainer.hide();
    }

    #hideEncyclopedia() {
        if (this.encyclopediaOpen) {
            this.ignoreNextClick = true;
            this.encyclopediaMenu.hide();
            this.encyclopediaExit.hide();
            this.encyclopediaOpen = false;
        }
    }

    #initializeDebugConsole() {
        this.debugConsole = createP('DEBUG TEXT');
        this.debugConsole.id('debugConsole');
        this.debugConsole.style('max-height', '100%');
        this.debugConsole.style('width', '100%');
        this.debugConsole.style('font-family', 'Andale Mono');
        this.debugConsole.style('font-size', '18px');
        this.debugConsole.style('color', color(255, 255, 255));
        this.debugConsole.style('background-color', color(81, 176, 101, 60));
        this.debugConsole.style('display', 'none');
        this.debugConsole.position(0, 0);
    }

    showDebugConsole(gameData) {
        this.debugConsole.style('display', 'block');
        this.debugConsole.html(gameData);
    }
    
}

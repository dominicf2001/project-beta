/** @module ui-handler */

export class UIHandler {
    constructor(windowWidth, windowHeight){
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        // STATE VARIABLES
        this.settingsOpen = false;
        this.encyclopediaOpen = false;
        this.ignoreNextClick = false;
        this.placeTowerButtonSelected = false;
        
        // UI IMAGE VARIABLES
        this.titleImg;
        this.gameOverScreen;
        this.startButton;
        this.loadButton;
        //this.nextWaveButton;
        this.settingsButton;
        this.saveButton;
        this.muteButton;
        this.placeStandardButton;
        this.placeFreezerButton;
        this.placePoisonorButton;
        this.upgradeContainer;
        this.upgradeRangeButton;
        this.upgradeFireRateButton;
        this.upgradeFireSpeedButton;
        this.debugConsole;
        
        this.encyclopediaMenu;
        this.encyclopediaButton;
        // image variables
        this.enemyStandard;
        this.enemySummoner;
        this.enemySummonee;

    }

    preloadAssets() {
        //this.titleImg = loadImage('./assets/GalacticGuardiansLogo2.png');
        this.titleImg = loadImage('./assets/Title Screen 2-1.png');
        this.enemyStandard = loadImage('./assets/Basic_Enemy.png');
        this.enemySummoner = loadImage('./assets/Summoner.png');
        this.enemySummonee = loadImage('./assets/Summonee.png');
    }

    initializeUI() {
        imageMode(CENTER);
        
        //image(this.titleImg, this.windowWidth / 2, (this.windowHeight / 2) - 100, 650, 375);
        image(this.titleImg, this.windowWidth / 2, (this.windowHeight / 2), this.windowWidth, this.windowHeight);

        this.#initializeToolbar();

        this.#initializeLoadAndSave();

        this.#initializeEncyclopedia();

        this.#initializeDebugConsole();

        this.gameOverScreen = createImg('./assets/Game_OVER_Screen.png');
        this.gameOverScreen.addClass('gameOver');

        this.startButton = createImg('./assets/GalacticGuardiansStartBtn.png');
        this.startButton.addClass('startButton');
        this.startButton.position(this.windowWidth - 325, this.windowHeight - 250);
        this.startButton.size(200, 100);

        this.loadButton = createButton('Load Save');
        this.loadButton.addClass('ui_buttons');
        this.loadButton.size(200, 40);
        this.loadButton.position(this.windowWidth - 325, this.windowHeight - 125);


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
        this.settingsButton.mousePressed(() =>
            this.#toggleSettings()
        );
        
        this.muteButton = createSpan('volume_up');
        this.muteButton.id('audioButton');
        this.muteButton.addClass('material-symbols-outlined');
        this.muteButton.position(this.windowWidth - 50, 60);
        this.muteButton.size(40, 40);

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
        toolBar.child(this.placeStandardButton);
        
        // const towerImg = createImg("./assets/RedMoonTower.png");
        this.placePoisonerButton = createButton();
        this.placePoisonerButton.addClass('ui_buttons');
        this.placePoisonerButton.addClass('toolbar_buttons');
        this.placePoisonerButton.addClass('place_tower_button');
        toolBar.child(this.placePoisonerButton);
        
        // const towerImg = createImg("./assets/RedMoonTower.png");
        this.placeFreezerButton = createButton();
        this.placeFreezerButton.addClass('ui_buttons');
        this.placeFreezerButton.addClass('toolbar_buttons');
        this.placeFreezerButton.addClass('place_tower_button');
        toolBar.child(this.placeFreezerButton);

        this.upgradeContainer = createDiv();
        this.upgradeContainer.addClass('toolbar_upgrades');
        toolBar.child(this.upgradeContainer);

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

    #initializeLoadAndSave() {
        this.saveButton = createButton('Save');
        this.saveButton.id('saveButton');
        this.saveButton.addClass('ui_buttons');
        this.saveButton.size(100, 40);
        this.saveButton.position(this.windowWidth - 390, 10);
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

    updateUIForGameMode(gameMode) {
        if (gameMode === -1) {
            this.upgradeRangeButton.hide();
            this.upgradeContainer.hide();
            this.upgradeFireRateButton.hide();
            this.upgradeFireSpeedButton.hide();
            this.placeStandardButton.hide();
            this.placeFreezerButton.hide();
            this.placePoisonerButton.hide();
            this.saveButton.hide();
            // this.nextWaveButton.hide();
            this.settingsButton.hide();
            this.muteButton.hide();
            this.gameOverScreen.show();
            this.nextLevelButton.hide();
        } else if (gameMode === 0) {
            this.upgradeContainer.hide();
            this.upgradeRangeButton.hide();
            this.upgradeFireRateButton.hide();
            this.upgradeFireSpeedButton.hide();
            this.placeStandardButton.hide();
            this.placeFreezerButton.hide();
            this.placePoisonerButton.hide();
            this.saveButton.hide();
            // this.nextWaveButton.hide();
            this.gameOverScreen.hide();
            this.settingsButton.hide();
            this.nextLevelButton.hide();
            this.muteButton.hide();
            this.encyclopediaButton.hide();
        } else if (gameMode === 1) {
            this.upgradeContainer.show();
            this.placeStandardButton.show();
            this.placeFreezerButton.show();
            this.placePoisonerButton.show();
            this.upgradeRangeButton.show();
            this.upgradeFireRateButton.show();
            this.upgradeFireSpeedButton.show();
            this.startButton.hide();
            this.loadButton.hide();
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
    
    #toggleSettings() {
        if (!this.settingsOpen) {
            this.muteButton.show();
            this.saveButton.show();
            this.settingsOpen = true;
        } else {
            this.muteButton.hide();
            this.saveButton.hide();
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
        this.debugConsole.style('background-color', color(81,176,101, 60));
        this.debugConsole.style('display', 'none');
        this.debugConsole.position(0, 0);
    }

    showDebugConsole(gameData) {
        this.debugConsole.style('display', 'block');
        this.debugConsole.html(gameData);
    }
}

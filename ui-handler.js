/** @module ui-handler */

export class UIHandler {
    constructor(windowWidth, windowHeight){
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;

        // STATE VARIABLES
        this.settingsOpen = false;
        this.encyclopediaOpen = false;
        this.ignoreNextClick = false;
        /**
         * 0 - place tower (default)
         * 1 - upgrade range
         * 2 - upgrade fire rate
         * 3 - upgrade fire speed
        */
        this.towerTool = 0;
        this.placeTowerButtonSelected = false;


        // UI IMAGE VARIABLES
        this.titleImg;
        this.gameOverScreen;
        this.startButton;
        this.nextWaveButton;
        this.settingsButton;
        this.muteButton;
        this.placeTowerButton;
        this.upgradeRangeButton;
        this.upgradeFireRateButton;
        this.upgradeFireSpeedButton;
        this.saveButton;
        this.loadButton;
        this.debugConsole;

        this.encyclopediaMenu;
        this.encyclopediaButton;
        this.enemy1;
    }

    preloadAssets() {
        this.titleImg = loadImage('./assets/GalacticGuardiansLogo2.png');
        this.enemy1 = loadImage('./assets/Basic_Enemy.png');
    }

    initializeUI() {
        imageMode(CENTER);
        
        image(this.titleImg, this.windowWidth / 2, (this.windowHeight / 2) - 100, 650, 375);

        this.#drawToolbar();

        this.#drawLoadAndSave();

        this.#drawEncyclopedia();

        this.#initializeDebugConsole();

        this.gameOverScreen = createImg('./assets/Game_OVER_Screen.png');
        this.gameOverScreen.addClass('gameOver');

        this.startButton = createImg('./assets/GalacticGuardiansStartBtn.png');
        this.startButton.addClass('startButton');
        this.startButton.size(200, 100);

        // draw "next wave" button
        this.nextWaveButton = createButton('Next Wave')
        this.nextWaveButton.id('nextWaveButton');
        this.nextWaveButton.position(this.windowWidth - 100, this.windowHeight + 15);

        // draw Next Level Button
        this.nextLevelButton = createButton('Next Level');
        this.nextLevelButton.id('nextLevelButton');
        this.nextLevelButton.position(this.windowWidth - 100, this.windowHeight + 45);

        this.settingsButton = createImg('./assets/settingsbutton.png');
        this.settingsButton.id('settingsButton');
        this.settingsButton.addClass('settingsMenu');
        this.settingsButton.position(this.windowWidth - 50, 10);
        this.settingsButton.size(40, 40);
        this.settingsButton.mousePressed(() =>
            this.#toggleSettings()
        );
        
        this.muteButton = createImg('./assets/audiobutton.png');
        this.muteButton.addClass('settingsMenu');
        this.muteButton.id('audioButton');
        this.muteButton.position(this.windowWidth - 50, 60);
        this.muteButton.size(40, 40);

        this.encyclopediaButton = createImg('./assets/encyclopediaButton.png');
        this.encyclopediaButton.position(this.windowWidth - 279, 10);
        this.encyclopediaButton.size(219, 40);
        this.encyclopediaButton.mousePressed(() =>
            this.#showEncyclopedia()
        );
        this.encyclopediaExit.mousePressed(() =>
            this.#hideEncyclopedia()
        );
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

    updateUIForGameMode(gameMode){
        if (gameMode === -1) {
            this.upgradeRangeButton.hide();
            this.upgradeFireRateButton.hide();
            this.upgradeFireSpeedButton.hide();
            this.loadButton.hide();
            this.placeTowerButton.hide();
            this.saveButton.hide();
            this.nextWaveButton.hide();
            this.settingsButton.hide();
            this.muteButton.hide();
            this.gameOverScreen.show();
        } else if (gameMode === 0) {
            this.upgradeRangeButton.hide();
            this.upgradeFireRateButton.hide();
            this.upgradeFireSpeedButton.hide();
            this.loadButton.hide();
            this.placeTowerButton.hide();
            this.saveButton.hide();
            this.nextWaveButton.hide();
            this.gameOverScreen.hide();
            this.settingsButton.hide();
            this.muteButton.hide();
            this.encyclopediaButton.hide();
        } else if (gameMode === 1) {
            this.upgradeRangeButton.show();
            this.upgradeFireRateButton.show();
            this.upgradeFireSpeedButton.show();
            this.startButton.hide();
            this.nextWaveButton.show();
            this.gameOverScreen.hide();
            this.encyclopediaButton.show();
            this.settingsButton.show();

            this.#drawTowerUpgradeMenu();
        }
    }

    #toggleSettings() {
        if (!this.settingsOpen) {
            this.muteButton.show();
            this.loadButton.show();
            this.saveButton.show();
            this.settingsOpen = true;
        } else {
            this.muteButton.hide();
            this.loadButton.hide();
            this.saveButton.hide();
            this.settingsOpen = false;
        }   
    }

    #drawToolbar() {
        this.placeTowerButton = createButton('Place Tower');
        this.placeTowerButton.id('placeTowerButton');
        this.placeTowerButton.style('font-family', 'Andale Mono');
        this.placeTowerButton.style('font-size', '18px');
        this.placeTowerButton.style('color', color(181, 43, 131));
        this.placeTowerButton.style('background-color', color(81, 176, 101));
        this.placeTowerButton.style('border', 'none');
        this.placeTowerButton.style('border-radius', '5px');
        this.placeTowerButton.style('padding', '5px 10px');
        this.placeTowerButton.style('font-weight', 'bold');
        this.placeTowerButton.position(10, this.windowHeight - 40);

        this.upgradeRangeButton = createButton('Upgrade Range');
        this.upgradeRangeButton.id('upgradeRangeButton');
        this.upgradeRangeButton.style('font-family', 'Andale Mono');
        this.upgradeRangeButton.style('font-size', '18px');
        this.upgradeRangeButton.style('color', color(181, 43, 131));
        this.upgradeRangeButton.style('background-color', color(81, 176, 101));
        this.upgradeRangeButton.style('border', 'none');
        this.upgradeRangeButton.style('border-radius', '5px');
        this.upgradeRangeButton.style('padding', '5px 10px');
        this.upgradeRangeButton.style('font-weight', 'bold');
        this.upgradeRangeButton.position(160, this.windowHeight - 40);
        this.upgradeRangeButton.mousePressed(() => {
            this.towerTool = 1;
        });
        this.upgradeFireRateButton = createButton('Upgrade Fire Rate');
        this.upgradeFireRateButton.id('upgradeFireRateButton');
        this.upgradeFireRateButton.style('font-family', 'Andale Mono');
        this.upgradeFireRateButton.style('font-size', '18px');
        this.upgradeFireRateButton.style('color', color(181, 43, 131));
        this.upgradeFireRateButton.style('background-color', color(81, 176, 101));
        this.upgradeFireRateButton.style('border', 'none');
        this.upgradeFireRateButton.style('border-radius', '5px');
        this.upgradeFireRateButton.style('padding', '5px 10px');
        this.upgradeFireRateButton.style('font-weight', 'bold');
        this.upgradeFireRateButton.position(335, this.windowHeight - 40);
        this.upgradeFireRateButton.mousePressed(() => {
            this.towerTool = 2;
        }); 

        this.upgradeFireSpeedButton = createButton('Upgrade Fire Speed');
        this.upgradeFireSpeedButton.id('upgradeFireSpeedButton');
        this.upgradeFireSpeedButton.style('font-family', 'Andale Mono');
        this.upgradeFireSpeedButton.style('font-size', '18px');
        this.upgradeFireSpeedButton.style('color', color(181, 43, 131));
        this.upgradeFireSpeedButton.style('background-color', color(81, 176, 101));
        this.upgradeFireSpeedButton.style('border', 'none');
        this.upgradeFireSpeedButton.style('border-radius', '5px');
        this.upgradeFireSpeedButton.style('padding', '5px 10px');
        this.upgradeFireSpeedButton.style('font-weight', 'bold');
        this.upgradeFireSpeedButton.position(565, this.windowHeight - 40);
        this.upgradeFireSpeedButton.mousePressed(() => {
            this.towerTool = 3;
        });
        
        
    }

    #drawLoadAndSave() {
        this.saveButton = createImg('./assets/saveButton.png');
        this.saveButton.id('saveButton');
        this.saveButton.addClass('settingsMenu');
        this.saveButton.size(100, 40);
        this.saveButton.position(this.windowWidth - 500, 10);

        this.loadButton = createImg('./assets/loadButton.png');
        this.loadButton.addClass('settingsMenu');
        this.loadButton.id('loadButton')
        this.loadButton.size(100, 40);
        this.loadButton.position(this.windowWidth - 390, 10);
    }

    /* Possible idea:
    Have rectangles over enemy info. If enemy appears on screen then remove rectangle 
    to reveal info.
    */
    #drawEncyclopedia() {
        // container
        this.encyclopediaMenu = createGraphics(this.windowWidth - 200, this.windowHeight - 100); 
        this.encyclopediaMenu.addClass("encyclopedia");
        this.encyclopediaMenu.style("display:block;");

        // exit button
        this.encyclopediaExit = createButton('X');
        this.encyclopediaExit.addClass('encyclopedia-exit');
        this.encyclopediaExit.position(this.windowWidth - 145, 60);
        this.encyclopediaMenu.textSize(15);
        
        // enemy info #1
        this.encyclopediaMenu.image(this.enemy1, 10, 20, 225, 275);
        this.encyclopediaMenu.text("Enemy 1", 250, 50, 200, 250);
        this.encyclopediaMenu.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", 250, 80, 200, 250);
        this.encyclopediaMenu.text("Damage: 1", 250, 210, 200, 250);

        // enemy info #2
        this.encyclopediaMenu.image(this.enemy1, 10, 300, 225, 275);
        this.encyclopediaMenu.text("Enemy 2", 250, 320, 200, 250);
        this.encyclopediaMenu.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", 250, 350, 200, 250);
        this.encyclopediaMenu.text("Damage: 1", 250, 470, 200, 250);

        // enemy info #3
        this.encyclopediaMenu.image(this.enemy1, 500, 20, 225, 275);
        this.encyclopediaMenu.text("Enemy 3", 750, 50, 200, 250);
        this.encyclopediaMenu.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", 750, 80, 200, 250);
        this.encyclopediaMenu.text("Damage: 1", 750, 210, 200, 250);

        // enemy info #4
        this.encyclopediaMenu.image(this.enemy1, 500, 300, 225, 275);
        this.encyclopediaMenu.text("Enemy 4", 750, 320, 200, 250);
        this.encyclopediaMenu.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", 750, 350, 200, 250);
        this.encyclopediaMenu.text("Damage: 1", 750, 470, 200, 250);


        this.encyclopediaMenu.hide();
        this.encyclopediaExit.hide();
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

    #drawTowerUpgradeMenu() {
        const toolbarColor = color(51, 51, 51);
        toolbarColor.setAlpha(200);

        this.placeTowerButton.show();
        this.upgradeRangeButton.show();
        this.upgradeFireRateButton.show();
        this.upgradeFireSpeedButton.show();

        // Update button colors
        switch (this.towerTool) {
            case 0:
                this.placeTowerButton.style('background-color', color(181, 43, 131));
                this.placeTowerButton.style('color', color(81, 176, 101));
                this.upgradeRangeButton.style('background-color', color(81, 176, 101));
                this.upgradeRangeButton.style('color', color(181, 43, 131));
                this.upgradeFireRateButton.style('background-color', color(81, 176, 101));
                this.upgradeFireRateButton.style('color', color(181, 43, 131));
                this.upgradeFireSpeedButton.style('background-color', color(81, 176, 101));
                this.upgradeFireSpeedButton.style('color', color(181, 43, 131));
                break;
            case 1:
                this.placeTowerButton.style('background-color', color(81, 176, 101));
                this.placeTowerButton.style('color', color(181, 43, 131));
                this.upgradeRangeButton.style('background-color', color(181, 43, 131));
                this.upgradeRangeButton.style('color', color(81, 176, 101));
                this.upgradeFireRateButton.style('background-color', color(81, 176, 101));
                this.upgradeFireRateButton.style('color', color(181, 43, 131));
                this.upgradeFireSpeedButton.style('background-color', color(81, 176, 101));
                this.upgradeFireSpeedButton.style('color', color(181, 43, 131));
                break;
            case 2:
                this.placeTowerButton.style('background-color', color(81, 176, 101));
                this.placeTowerButton.style('color', color(181, 43, 131));
                this.upgradeRangeButton.style('background-color', color(81, 176, 101));
                this.upgradeRangeButton.style('color', color(181, 43, 131));
                this.upgradeFireRateButton.style('background-color', color(181, 43, 131));
                this.upgradeFireRateButton.style('color', color(81, 176, 101));
                this.upgradeFireSpeedButton.style('background-color', color(81, 176, 101));
                this.upgradeFireSpeedButton.style('color', color(181, 43, 131));
                break;
            case 3:
                this.placeTowerButton.style('background-color', color(81, 176, 101));
                this.placeTowerButton.style('color', color(181, 43, 131));
                this.upgradeRangeButton.style('background-color', color(81, 176, 101));
                this.upgradeRangeButton.style('color', color(181, 43, 131));
                this.upgradeFireRateButton.style('background-color', color(81, 176, 101));
                this.upgradeFireRateButton.style('color', color(181, 43, 131));
                this.upgradeFireSpeedButton.style('background-color', color(181, 43, 131));
                this.upgradeFireSpeedButton.style('color', color(81, 176, 101));
                break;
        }

        push();
        fill(toolbarColor);
        noStroke();
        rect(0, this.windowHeight, this.windowWidth, 50);
        pop();
    }
}

/** @module ui-handler */

export class UIHandler {
    constructor(windowWidth, windowHeight){
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        
        // CLICK HANDLERS
        this.onSaveClick = () => {};
        this.onLoadClick = () => {};
        this.onStartClick = () => {};
        this.onMuteClick = () => {};
        this.onNextWaveClick = () => {};

        // STATE VARIABLES
        this.settingsOpen = false;
        this.encyclopediaOpen = false;
        /**
         * 0 - place tower (default)
         * 1 - upgrade range
         * 2 - upgrade fire rate
        */
        this.towerTool = 0;

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
        this.saveButton;
        this.loadButton;
        this.encyclopediaMenu;
        this.encyclopediaButton;
        this.encyclopediaExitButton;
    }

    preloadAssets() {
        this.titleImg = loadImage('./assets/GalacticGuardiansLogo2.png');
    }

    initializeUI() {
        imageMode(CENTER);
        
        image(this.titleImg, this.windowWidth / 2, (this.windowHeight / 2) - 100, 650, 375);

        this.#drawToolbar();

        this.#drawLoadAndSave();

        this.#drawEncyclopedia();

        this.gameOverScreen = createImg('./assets/Game_OVER_Screen.png');
        this.gameOverScreen.addClass('gameOver');

        this.startButton = createImg('./assets/GalacticGuardiansStartBtn.png');
        this.startButton.addClass('startButton');
        this.startButton.size(200, 100);
        this.startButton.mousePressed(() =>
            this.onStartClick()
        );

        // draw "next wave" button
        this.nextWaveButton = createButton('Next Wave')
        this.nextWaveButton.position(this.windowWidth - 100, this.windowHeight + 15);
        this.nextWaveButton.mousePressed(() =>
            this.onNextWaveClick()
        );

        this.settingsButton = createImg('./assets/settingsbutton.png');
        this.settingsButton.addClass('settingsMenu');
        this.settingsButton.position(this.windowWidth - 50, 10);
        this.settingsButton.size(40, 40);
        this.settingsButton.mousePressed(() =>
            this.#toggleSettings()
        );
        
        this.muteButton = createImg('./assets/audiobutton.png');
        this.muteButton.addClass('settingsMenu');
        this.muteButton.position(this.windowWidth - 50, 60);
        this.muteButton.size(40, 40);
        this.muteButton.mousePressed(() =>
            this.onMuteClick()
        );
    }

    handleEscapeKeyPress() {
        if (!this.encyclopiaOpen)
            openSettings();
        if (this.encyclopiaOpen) {
            this.encyclopedia.hide();
            this.encyclopediaExit.hide();
            this.encyclopiaOpen = false;
        }
    }

    updateUIForGameMode(gameMode){
        if (gameMode === -1) {
            this.upgradeRangeButton.hide();
            this.upgradeFireRateButton.hide();
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
            this.loadButton.hide();
            this.placeTowerButton.hide();
            this.saveButton.hide();
            this.nextWaveButton.hide();
            this.gameOverScreen.hide();
            this.settingsButton.hide();
            this.muteButton.hide();
        } else if (gameMode === 1) {
            this.upgradeRangeButton.show();
            this.upgradeFireRateButton.show();
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
        this.placeTowerButton.style('font-family', 'Andale Mono');
        this.placeTowerButton.style('font-size', '18px');
        this.placeTowerButton.style('color', color(181, 43, 131));
        this.placeTowerButton.style('background-color', color(81, 176, 101));
        this.placeTowerButton.style('border', 'none');
        this.placeTowerButton.style('border-radius', '5px');
        this.placeTowerButton.style('padding', '5px 10px');
        this.placeTowerButton.style('font-weight', 'bold');
        this.placeTowerButton.position(10, this.windowHeight - 40);
        this.placeTowerButton.mousePressed(() => {
            this.towerTool = 0;
        });

        this.upgradeRangeButton = createButton('Upgrade Range');
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
        this.upgradeFireRateButton = createButton('Upgrade Fire Speed');
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
    }

    #drawLoadAndSave() {
        this.saveButton = createImg('./assets/saveButton.png');
        this.saveButton.addClass('settingsMenu');
        this.saveButton.size(100, 40);
        this.saveButton.position(this.windowWidth - 500, 10);
        this.saveButton.mousePressed(()=>
            this.onSaveClick()
        );

        this.loadButton = createImg('./assets/loadButton.png');
        this.loadButton.addClass('settingsMenu');
        this.loadButton.size(100, 40);
        this.loadButton.position(this.windowWidth - 390, 10);
        this.loadButton.mousePressed(()=>
            this.onLoadClick()
        ); 
    }

    #drawEncyclopedia() {
        // encyclopedia
        this.encyclopediaMenu = createGraphics(this.windowWidth - 200, this.windowHeight - 100); // container
        this.encyclopediaMenu.addClass('encyclopedia');
        this.encyclopediaButton = createImg('./assets/encyclopediaButton.png');
        this.encyclopediaButton.position(this.windowWidth - 279, 10);
        this.encyclopediaButton.size(219, 40);
        
        this.encyclopediaButton.mousePressed(() => {
            if (!this.encyclopiaOpen) {
                this.encyclopediaExitButton = createButton('X');
                this.encyclopediaExitButton.addClass('encyclopedia-exit');
                this.encyclopediaExitButton.position(this.windowWidth - 135, 55);
                this.encyclopediaButton.style('display:block;');
                this.encyclopiaOpen = true;

                this.encyclopediaExitButton.mousePressed(() => { // closes encyclopedia
                    if (this.encyclopiaOpen) {
                        this.encyclopediaButton.style('display:none');
                        this.encyclopiaOpen = false;
                        this.encyclopediaExitButton.hide();
                        this.encyclopediaButton.show();
                    }
                });
            }
        });        
    }

    #drawTowerUpgradeMenu() {
        const toolbarColor = color(51, 51, 51);
        toolbarColor.setAlpha(200);

        this.placeTowerButton.show();
        this.upgradeRangeButton.show();
        this.upgradeFireRateButton.show();

        // Update button colors
        switch (this.towerTool) {
            case 0:
                this.placeTowerButton.style('background-color', color(181, 43, 131));
                this.placeTowerButton.style('color', color(81, 176, 101));
                this.upgradeRangeButton.style('background-color', color(81, 176, 101));
                this.upgradeRangeButton.style('color', color(181, 43, 131));
                this.upgradeFireRateButton.style('background-color', color(81, 176, 101));
                this.upgradeFireRateButton.style('color', color(181, 43, 131));
                break;
            case 1:
                this.placeTowerButton.style('background-color', color(81, 176, 101));
                this.placeTowerButton.style('color', color(181, 43, 131));
                this.upgradeRangeButton.style('background-color', color(181, 43, 131));
                this.upgradeRangeButton.style('color', color(81, 176, 101));
                this.upgradeFireRateButton.style('background-color', color(81, 176, 101));
                this.upgradeFireRateButton.style('color', color(181, 43, 131));
                break;
            case 2:
                this.placeTowerButton.style('background-color', color(81, 176, 101));
                this.placeTowerButton.style('color', color(181, 43, 131));
                this.upgradeRangeButton.style('background-color', color(81, 176, 101));
                this.upgradeRangeButton.style('color', color(181, 43, 131));
                this.upgradeFireRateButton.style('background-color', color(181, 43, 131));
                this.upgradeFireRateButton.style('color', color(81, 176, 101));
                break;
        }

        push();
        fill(toolbarColor);
        noStroke();
        rect(0, this.windowHeight, this.windowWidth, 50);
        pop();
    }
}

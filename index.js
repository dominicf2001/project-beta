import Enemy from "./enemy.js";
import { Tower, Bullet }  from "./tower.js";


// GLOBAL VARIABLES

// 0 - main menu
// 1 - start game
var gameMode = 0;
let f_Andale;

let windowWidth = 1200;
let windowHeight = 700;

const path = [
    { x: 0, y: 380 },
    { x: 1190, y: 380 },
];

const enemies = [
    new Enemy(0.1, 10, path, 140, 3),
    new Enemy(0.3, 5, path, 80, 1),
    new Enemy(0.05, 25, path, 300, 6)
];

// tower variables
const towerLimit = 5;
const towers = [];
const bullets = [];
let dragTower = null;
let playSound = false;

// other relevant variables
let totalCurrency = 0;
let totalHealth = 50;

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
                if(mouseX >= windowWidth -15 && mouseY > 30 || mouseY < 70){
                   // throw new Error("NO");
                }else{
                towers.push(t);
                }

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
let settings;
let settingsMute;

let mapImg;
let titleImg;
var startButton;

window.preload = function(){
    mySound = loadSound('./assets/potassium.mp3');
    f_Andale = loadFont('./assets/Andale-Mono.ttf');
    mapImg = loadImage('Maps/Tower Defense Map Ideas.png'); // Loads the Map
    titleImg = loadImage('./assets/GalacticGuardiansLogo2.png');
    startImg = loadImage('./assets/GalacticGuardiansStartBtn.png');

}

window.setup = function() {
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER);

    startButton = createImg('./assets/GalacticGuardiansStartBtn.png');
    startButton.position((windowWidth/2)-90, (windowHeight/2)+100);
    startButton.size(200,100);
    startButton.mousePressed(function() {
        gameMode = 1;
        if (!playSound) {
            mySound.setVolume(0.3);
            mySound.play();
            playSound = true;
        }
    })
    
    // Fire bullets every 400mps
    setInterval(fireBullets, 400);
}

window.draw = function() {
    if (gameMode == 0) {
        mainMenu();
    }
    if (gameMode == 1) {
        startButton.hide();
        settingsMenu();

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

        // draw or remove enemies
        for (const i in enemies) {
            if (enemies[i].hasReachedEnd()) {
                totalHealth -= enemies[i].damage;
                if (totalHealth < 0) {} // Implement game over screen
                enemies.splice(i, 1);
            } else if (enemies[i].health <= 0) {
                totalCurrency += enemies[i].currency;
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
    background('#141414');
    image(titleImg, windowWidth / 2, (windowHeight / 2) - 100, 650, 375);
}

function settingsMenu() {
    let settingsX = windowWidth-35
    let b1settingsY = 15;
    let b2settingsY = 50;
    settings = createImg('./assets/settingsbutton.png');
    settings.position(settingsX, b1settingsY);
    settings.size(30,30);
    settings.mousePressed(function() {
        settingsMute = createImg('./assets/audiobutton.png');
        settingsMute.position(settingsX, b2settingsY);
        settingsMute.size(30,30);
        settingsMute.mousePressed(function() {
            if (playSound) {
                mySound.pause();
                playSound = false;
            } else {
                mySound.play();
                playSound = true;
            }
            })
        
        
    })
    
}

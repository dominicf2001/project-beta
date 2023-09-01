let towerLimit = 5;
let towers = [];

class Tower {
    constructor(x, y) {
        if (towerLimit <= 0) {
            throw new Error("No more towers allowed!");
        }
        this.x = x;
        this.y = y;
        this.range = 5;
        this.damage = 1;
        this.fireRate = 1;
        towerLimit--;
    }

    draw() {
        fill(152, 84, 235);
        rect(this.x, this.y, 20, 20);
    }
};

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(0);

    // draw path
    for(let t of towers) {
        t.draw();
    }
}

function mousePressed(event) {
    console.log(event);
    // Ignore touch events, only handle left mouse button
    if (event.button === 0) {
        try {
            towers.push(new Tower(mouseX, mouseY));
        } catch (e) {
            alert(e);
        }
    }
}
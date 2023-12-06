// helper
const e = Object.freeze({
    "tank": 0,
    "standard": 1,
    "rapid": 2,
    "spawner": 3,
    "stunner": 4,
    "boss": 5,
});

// VARIABLES
export const PRIMARY_COLOR = "color(237, 112, 192)";
export const SECONDARY_COLOR = "color(81, 176, 101)";
export const WINDOW_WIDTH = 1200;
export const WINDOW_HEIGHT = 700;
export const TOWER_LIMIT = Infinity;
export const DEFAULT_CURRENCY = 1500;
export const DEFAULT_HEALTH = 25;
export const DEFAULT_WAVE_INIT_TIME = 5;

// LEVELS
export const LEVELS = [
    // level 1
    {
        LEVEL_DATA: [
            [[], [1, 2], [1], [], [], []],
            [[], [1, 1], [3, 2], [], [], []],
            [[2, 1], [4, 2], [2], [], [], []],
            [[], [2, 2, 2], [2, 1, 2], [1], [], []]
        ],
        PRIORITY_DATA: [
            [e.standard, e.rapid, e.standard],
            [e.standard, e.rapid, e.standard, e.rapid],
            [e.standard, e.tank, e.rapid, e.tank, e.standard],
            [e.standard, e.rapid, e.rapid, e.standard, e.rapid, e.standard, e.spawner],
        ]
    },
    // level 2
    {
        LEVEL_DATA: [
            [[2, 1], [1, 2], [], [1], [], []],
            [[], [2], [2, 2], [2], [], []],
            [[6], [3, 5, 3], [2, 5], [1], [], []],
            [[4, 2], [8, 8, 8, 4], [10], [2], [], []],
        ],
        PRIORITY_DATA: [
            [e.tank, e.standard, e.tank, e.standard, e.spawner],
            [e.standard, e.spawner, e.stunner, e.rapid, e.rapid],
            [e.tank, e.standard, e.standard, e.spawner, e.standard, e.rapid, e.rapid],
            [e.standard, e.standard, e.tank, e.spawner, e.standard, e.standard, e.rapid, e.tank],
        ]
    },
    // level 3
    {
        LEVEL_DATA: [
            [[], [1, 3], [2, 2], [], [], []],
            [[], [], [], [], [], [1]],
        ],
        PRIORITY_DATA: [
            [e.standard, e.rapid, e.rapid, e.standard, e.boss],
            [e.boss]
        ]
    },
    // Tutorial Level
    {
        LEVEL_DATA: [
            [[], [1, 1], [2, 1], [], [], []]
        ],
        PRIORITY_DATA: [
            [e.standard, e.rapid, e.rapid, e.standard]
        ]
    }
];

// ENEMIES
// order matters here
export const ENEMIES = [
    // enemy 0: TANK
    {
        APPEARANCE: "tank",
        SPEED: .7,
        HEALTH: 18,
        CURRENCY: 250,
        DAMAGE: 2,
        DAMAGE_DISTANCE: 1
    },
    // enemy 1: STANDARD
    {
        APPEARANCE: "standard",
        SPEED: 1.4,
        HEALTH: 8,
        CURRENCY: 125,
        DAMAGE: 4,
        DAMAGE_DISTANCE: 10
    },
    // enemy 2: RAPID
    {
        APPEARANCE: "rapid",
        SPEED: 2.2,
        HEALTH: 6,
        CURRENCY: 80,
        DAMAGE: 1,
        DAMAGE_DISTANCE: 1
    },
    // enemy 3: SPAWNER
    {
        APPEARANCE: "spawner",
        SPEED: 1.4,
        HEALTH: 10,
        CURRENCY: 175,
        DAMAGE: 2,
        DAMAGE_DISTANCE: 1
    },
    // enemy 4: STUNNER
    {
        APPEARANCE: "stunner",
        SPEED: 0.2,
        HEALTH: 5,
        CURRENCY: 10,
        DAMAGE: 2,
        DAMAGE_DISTANCE: 1
    },
    // enemy 5: BOSS
    {
        APPEARANCE: "boss",
        SPEED: 0.3,
        HEALTH: 100,
        CURRENCY: 1000,
        DAMAGE: 50,
        DAMAGE_DISTANCE: 1
    }
];

// MAPS
export const MAPS = [
    // First map
    {
        topPath: function (x) {
            return 166.8354 + 1.043129 * x - 0.003942524 * (x * x) + 0.00000607239 * (x * x * x) - 4.46637e-9 * (x * x * x * x) + 1.352265e-12 * (x * x * x * x * x);
        },
        middlePath: function (x) {
            return 246.768 + 0.6824144 * x - 0.002826065 * (x * x) + 0.000004403122 * (x * x * x) - 3.39375e-9 * (x * x * x * x) + 1.15278e-12 * (x * x * x * x * x);
        },
        bottomPath: function (x) {
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
        isColliding: function (x, diameter) {
            return mouseY < MAPS[0].bottomPath(x) && mouseY > MAPS[0].topPath(x) - diameter;
        }
    },
    { // Second Map
        topPath: function (x) {
            return 520;
        },
        middlePath: function (x) {
            return 530;
        },
        bottomPath: function (x) {
            if (x < 768) {
                return 650;
            }
            else if (x >= 768) {
                return 650;
            }
        },
        isColliding: function (x, diameter) {
            // return mouseY < MAPS[1].bottomPath(x) && mouseY > MAPS[1].topPath(x) - diameter;
        }
    },
    { // Third Map
    //TODO: implement topPath, bottomPath, and isColliding
        topPath: function (x) {
            return 520;
        },
        middlePath: function (x, theta) {
            if (x < 223) return 363;
            else {
                return {
                    x: -28.72746723*theta*Math.cos(theta),
                    y: -28.72746723*theta*Math.sin(theta)
                }
            }
        },
        bottomPath: function (x) {
            if (x < 768) {
                return 650;
            }
            else if (x >= 768) {
                return 650;
            }
        },       
        isColliding: function(x, diameter) {
            console.log(mouseX, mouseY);
            /*return !((mouseY > 150 && mouseY < 200) && (x > 400 && x < 600)
                || ((mouseY > 140 && mouseY < 185) && (x > 630 && x < 700))
                || ((mouseY > 370 && mouseY < 415) && (x > 630 && x < 700))
                || ((mouseY > 370 && mouseY < 415) && (x > 330 && x < 400))
                || ((mouseY > 400 && mouseY < 440) && (x > 800 && x < 900))
                || ((mouseY > 100 && mouseY < 190) && (x > 800 && x < 880))
                || ((mouseY > 520 && mouseY < 570) && (x > 540 && x < 725)));*/
        }
    },
    // Tutorial Map (first map)
    {
        topPath: function (x) {
            return 166.8354 + 1.043129 * x - 0.003942524 * (x * x) + 0.00000607239 * (x * x * x) - 4.46637e-9 * (x * x * x * x) + 1.352265e-12 * (x * x * x * x * x);
        },
        middlePath: function (x) {
            return 246.768 + 0.6824144 * x - 0.002826065 * (x * x) + 0.000004403122 * (x * x * x) - 3.39375e-9 * (x * x * x * x) + 1.15278e-12 * (x * x * x * x * x);
        },
        bottomPath: function (x) {
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
        isColliding: function (x, diameter) {
            return mouseY < MAPS[0].bottomPath(x) && mouseY > MAPS[0].topPath(x) - diameter;
        }
    },
    
];

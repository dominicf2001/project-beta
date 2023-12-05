import { strict as assert } from 'assert';
import { Tower, Standard, Freezer, Poisoner, Bullet, towerCosts } from "./tower.js";

describe('Tower Unit Tests', () => {
  it('Upgrade Range', () => {
    let t = new Standard(0, 0);
    let old = t.range;
    t.upgradeRange();
    assert.equal(t.range, old + 10);
  });

  it('Upgrade Fire Speed', () => {
    let t = new Standard(0, 0);
    let old = t.fireSpeed;
    t.upgradeFireSpeed();
    assert.equal(t.fireSpeed, old + 1);
  });

  it('Upgrade Fire Rate', () => {
    let t = new Standard(0, 0);
    let old = t.fireRate;
    t.upgradeFireRate();
    assert.equal(t.fireRate, old + 1);
  });
});

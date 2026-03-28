/**
 * Sunflower checkpoint: every instance uses the same visuals until touched —
 * ground aura, light beam to the sun, and an ungrown bud — then scales into
 * the full flower. Optional prerequisite gates bloom/respawn order.
 */
class Checkpoint {
  constructor(x, y, text = "Checkpoint", options = {}) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.messageShown = false;
    this.stemH = 44;
    this.headY = -this.stemH;
    this.hitR = 24;

    /** Must be reached first (its flower bloomed) before this one can bloom or count for respawn */
    this.prerequisite = options.prerequisite ?? null;

    /** Set false only to skip beam/bud (default: all checkpoints use them) */
    this.useBeamAndGrow = options.useBeamAndGrow !== false;

    this.reached = false;
    this.bloomT = 0;
    this.bloomDuration = 52;
    this.sunWorldY = 64;
  }

  prerequisiteMet() {
    return !this.prerequisite || this.prerequisite.reached;
  }

  update(player) {
    const centerY = this.y + this.headY;
    const touching =
      dist(player.x, player.y, this.x, centerY) < player.r + this.hitR;
    const canProgress = this.prerequisiteMet();

    if (touching && !this.reached && canProgress) {
      this.reached = true;
      this.bloomT = 0;
    }
    if (this.reached && this.bloomT < this.bloomDuration) {
      this.bloomT++;
    }
    return touching && canProgress;
  }

  bloomScale() {
    if (!this.reached) return 0;
    const t = constrain(this.bloomT / this.bloomDuration, 0, 1);
    const eased = 1 - pow(1 - t, 3);
    return lerp(0.18, 1, eased);
  }

  drawLightBeamAndSun() {
    const budTipY = -14;
    const topY = this.sunWorldY - this.y;
    const pulse = 0.82 + 0.18 * sin(frameCount * 0.055);

    push();
    blendMode(ADD);

    const wBot = 16 * pulse;
    const wTop = 48 * pulse;
    for (let i = 0; i < 4; i++) {
      const layer = i / 3;
      const a = (22 - i * 5) * pulse;
      fill(255, 248, 210, a);
      noStroke();
      quad(
        -wBot * (1 - layer * 0.15),
        budTipY,
        wBot * (1 - layer * 0.15),
        budTipY,
        wTop * (1 - layer * 0.12),
        topY,
        -wTop * (1 - layer * 0.12),
        topY,
      );
    }

    translate(0, topY);
    for (let i = 0; i < 5; i++) {
      const r = 28 + i * 14;
      fill(255, 235, 160, 14 - i * 2);
      noStroke();
      ellipse(0, 0, r, r * 0.92);
    }
    fill(255, 252, 220, 200 * pulse);
    ellipse(0, 0, 22, 20);

    blendMode(BLEND);
    pop();
  }

  drawGroundAura() {
    const pulse = 0.88 + 0.12 * sin(frameCount * 0.07 + this.x * 0.01);
    push();
    blendMode(ADD);
    for (let i = 0; i < 6; i++) {
      const r = 20 + i * 12;
      fill(255, 230, 140, (10 - i) * pulse);
      noStroke();
      ellipse(0, -4, r, r * 0.55);
    }
    blendMode(BLEND);
    pop();
  }

  drawBud() {
    stroke(55, 110, 45);
    strokeWeight(4);
    noFill();
    line(0, 0, 0, -12);

    noStroke();
    fill(65, 130, 52);
    ellipse(5, -4, 8, 14);
    ellipse(-4, -6, 7, 11);

    fill(255, 220, 80, 230);
    ellipse(0, -14, 10, 11);
    fill(255, 245, 180, 180);
    ellipse(-2, -16, 4, 4);
  }

  drawMatureFlower() {
    stroke(60, 120, 50);
    strokeWeight(6);
    noFill();
    line(0, 0, 0, this.headY);

    noStroke();
    fill(70, 140, 55);
    ellipse(4, this.headY + 20, 10, 18);
    ellipse(-6, this.headY + 8, 8, 14);

    fill(255, 200, 40);
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
      const a = (i / petalCount) * TAU;
      push();
      translate(0, this.headY);
      rotate(a);
      ellipse(14, 0, 12, 8);
      pop();
    }

    fill(90, 55, 25);
    noStroke();
    ellipse(0, this.headY, 16, 16);

    fill(120, 75, 35);
    ellipse(-3, this.headY - 3, 6, 6);
  }

  draw() {
    push();
    translate(this.x, this.y);

    if (!this.useBeamAndGrow) {
      this.drawMatureFlower();
      pop();
      return;
    }

    if (!this.reached) {
      this.drawLightBeamAndSun();
      this.drawGroundAura();
      this.drawBud();
      pop();
      return;
    }

    const s = this.bloomScale();
    scale(s);
    this.drawMatureFlower();
    pop();
  }
}

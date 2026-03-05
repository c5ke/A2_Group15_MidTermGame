class Checkpoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.poleH = 48;
    this.poleW = 4;
    this.flagW = 28;
    this.flagH = 20;
    this.hitR = 24;
  }

  update(player) {
    const d = dist(player.x, player.y, this.x + this.poleW / 2, this.y - this.poleH / 2);
    return d < player.r + this.hitR;
  }

  draw() {
    push();
    translate(this.x, this.y);

    // Pole
    fill(80, 60, 40);
    stroke(60, 45, 30);
    strokeWeight(1);
    rect(0, 0, this.poleW, -this.poleH);

    // Flag (triangle)
    noStroke();
    fill(50, 180, 80);
    beginShape();
    vertex(this.poleW, -this.poleH);
    vertex(this.poleW + this.flagW, -this.poleH + this.flagH / 2);
    vertex(this.poleW, -this.poleH + this.flagH);
    endShape(CLOSE);

    // Pole top (finial)
    fill(220, 180, 80);
    ellipse(this.poleW / 2, -this.poleH, 8, 8);

    pop();
  }
}

class Platform {
  constructor(x, y, w, h, color = null, options = {}) {
    this.baseX = x;
    this.baseY = y;
    this.x = x; 
    this.y = y;
    this.w = w; 
    this.h = h;
    this.color = color;
    
    // Movement options
    this.isMoving = options.isMoving || false;
    this.rangeX = options.rangeX || 0;
    this.rangeY = options.rangeY || 0;
    this.speed = options.speed || 0.02;
    this.offset = options.offset || 0;
    this.reverse = options.reverse || false;

    // Disappearing options
    this.isDisappearing = options.isDisappearing || false;
    this.visibleDuration = options.visibleDuration || 120; // frames
    this.hiddenDuration = options.hiddenDuration || 120;   // frames
    this.fadeFrames = options.fadeFrames || 20;           // frames for fade in/out
    this.timer = options.timerOffset || 0;
    this.isVisible = true;
    this.alpha = 1;  // 0–1 for fading
  }

  update() {
    this.lastX = this.x;
    this.lastY = this.y;
    
    if (this.isMoving) {
      let t = frameCount * this.speed + this.offset + (this.reverse ? PI : 0);
      this.x = this.baseX + cos(t) * this.rangeX;
      this.y = this.baseY + sin(t) * this.rangeY;
    }

    if (this.isDisappearing) {
      this.timer++;
      let cycle = this.visibleDuration + this.hiddenDuration;
      let phase = this.timer % cycle;
      this.isVisible = phase < this.visibleDuration;

      // Fade in at start of visible, fade out at end
      let fd = min(this.fadeFrames, this.visibleDuration / 2);
      if (phase >= this.visibleDuration) {
        this.alpha = 0;
      } else if (phase < fd) {
        this.alpha = phase / fd;
      } else if (phase >= this.visibleDuration - fd) {
        this.alpha = (this.visibleDuration - phase) / fd;
      } else {
        this.alpha = 1;
      }
    }
  }
}

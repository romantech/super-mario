import DomManager from './domManager.js';

class Background {
  constructor({ speed = 5 } = {}) {
    this.speed = speed;
    this.positionX = 0;
    this.frameId = null;
    this.move = this.move.bind(this);
  }

  move() {
    this.positionX -= this.speed;
    DomManager.gameArea.style.backgroundPositionX = this.positionX + 'px';
    this.frameId = requestAnimationFrame(this.move);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }
}

export default Background;

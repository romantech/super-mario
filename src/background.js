import DomManager from './dom-manager.js';

class Background {
  constructor({ speed }) {
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

  reset() {
    this.positionX = 0;
    DomManager.gameArea.style.backgroundPositionX = this.positionX + 'px';
  }
}

export default Background;

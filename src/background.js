import DomManager from './dom-manager.js';

class Background {
  speed;
  positionX = 0;
  frameId = null;

  constructor({ speed }) {
    this.speed = speed;
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

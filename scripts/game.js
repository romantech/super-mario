// game.js
import Mario from './mario.js';
import Background from './background.js';
import Obstacles from './obstacle.js';
import DomManager from './domManager.js';

class Game {
  constructor() {
    this.mario = new Mario({ onJumpComplete: this.addScore.bind(this) });
    this.background = new Background();
    this.obstacles = new Obstacles();
    this.obstacleTimerId = null;
    this.score = 0;
    this.frameId = null;
  }

  addScore() {
    this.score += 1;
    DomManager.score.textContent = String(this.score);
  }

  start() {
    this.background.move();
    this.checkCollision();
    this.obstacleTimerId = setInterval(
      this.obstacles.addObstacle.bind(this.obstacles),
      2500,
    );

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  stop() {
    this.background.stop();
    cancelAnimationFrame(this.frameId);
    clearInterval(this.obstacleTimerId);
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));

    alert('충돌 발생! 게임 오버');
  }

  checkCollision() {
    for (let obstacle of [...this.obstacles.obstacles]) {
      if (this.isColliding(this.mario, obstacle)) {
        this.stop();
        return;
      }
    }
    this.frameId = requestAnimationFrame(this.checkCollision.bind(this));
  }

  isColliding(mario, obstacle) {
    // ... 충돌 감지 로직
  }

  handleKeyDown(e) {
    if (e.code === 'Space') this.mario.jump();
  }
}

export default Game;

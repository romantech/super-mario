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
    this.score = 0;
    this.obstacleTimerId = null;
    this.collisionFrameId = null;

    // 동일한 참조의 이벤트 핸들러를 사용해야 이벤트를 제거할 수 있으므로 this.handleKeyDown 메서드 바인딩
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.checkCollision = this.checkCollision.bind(this);
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

    document.addEventListener('keydown', this.handleKeyDown);
  }

  stop() {
    this.background.stop();
    cancelAnimationFrame(this.collisionFrameId);
    clearInterval(this.obstacleTimerId);
    document.removeEventListener('keydown', this.handleKeyDown);

    alert('충돌 발생! 게임 오버');
  }

  checkCollision() {
    for (let obstacle of this.obstacles.list) {
      if (this.isColliding(this.mario, obstacle)) {
        return this.stop();
      }
    }
    this.collisionFrameId = requestAnimationFrame(this.checkCollision);
  }

  isColliding(mario, obstacle) {
    const marioRect = mario.element.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();
    return (
      marioRect.left < obstacleRect.right &&
      marioRect.right > obstacleRect.left &&
      marioRect.top < obstacleRect.bottom &&
      marioRect.bottom > obstacleRect.top
    );
  }

  handleKeyDown(e) {
    if (e.code === 'Space') this.mario.jump();
  }
}

export default Game;

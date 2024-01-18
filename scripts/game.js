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
    this.isRunning = false;
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
    if (this.isRunning) return;
    this.isRunning = true;

    this.obstacles.moveAll();
    this.background.move();
    this.checkCollision();
    this.obstacleTimerId = setInterval(
      this.obstacles.add.bind(this.obstacles),
      2500,
    );

    document.addEventListener('keydown', this.handleKeyDown);
  }

  stop(message = '') {
    this.isRunning = false;

    this.background.stop();
    this.obstacles.stopAll();
    cancelAnimationFrame(this.collisionFrameId);
    clearInterval(this.obstacleTimerId);

    document.removeEventListener('keydown', this.handleKeyDown);

    if (message) setTimeout(() => alert(message));
  }

  checkCollision() {
    for (let obstacle of this.obstacles.list) {
      if (this.isColliding(this.mario, obstacle)) {
        return this.stop('Game Over!');
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
    if (e.code === 'Space') {
      // "시작" 버튼을 누르면 버튼에 포커스된 상태가 되고,
      // 스페이스를 누르면 기본 동작으로 인해 시작 버튼이 클릭되는 문제 있음
      // preventDefault()를 이용해 기본 동작을 해제하면 문제 발생 안함
      e.preventDefault();
      this.mario.jump();
    }
  }
}

export default Game;

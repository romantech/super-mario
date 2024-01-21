import Mario from './mario.js';
import Background from './background.js';
import ObstacleManager from './obstacle.js';
import EventHandler from './event-handler.js';
import DomManager from './domManager.js';

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Game {
  constructor({ speed, defaultBottom }) {
    this.mario = new Mario({ defaultBottom });
    this.background = new Background({ speed });
    this.obstacles = new ObstacleManager();
    this.eventHandler = new EventHandler(() => this.mario.jump());

    this.score = 0;
    this.isPlaying = false;
    this.obstacleTimerId = null;
    this.collisionFrameId = null;
    this.lastPassedObstacle = null;

    // 동일한 참조의 이벤트 핸들러를 사용해야 이벤트를 제거할 수 있으므로 this.handleKeyDown 메서드 바인딩
    this.checkCollision = this.checkCollision.bind(this);
  }

  addScore() {
    this.score += 1;
    DomManager.score.textContent = String(this.score);
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.obstacles.moveAll();
    this.background.move();
    this.eventHandler.setupEventListeners();
    this.checkCollision();
    this.scheduleAddObstacle();
  }

  stop(message = '') {
    this.isPlaying = false;

    this.background.stop();
    this.obstacles.stopAll();
    this.eventHandler.removeEventListeners();
    cancelAnimationFrame(this.collisionFrameId);
    clearInterval(this.obstacleTimerId);

    if (message) alert(message);
  }

  scheduleAddObstacle() {
    const randomInterval = generateRandomNumber(700, 2000);
    this.obstacleTimerId = setTimeout(() => {
      this.obstacles.add();
      if (this.isPlaying) this.scheduleAddObstacle();
    }, randomInterval);
  }

  checkCollision() {
    for (let obstacle of this.obstacles.list) {
      const marioRect = this.mario.element.getBoundingClientRect();
      const obstacleRect = obstacle.element.getBoundingClientRect();

      if (this.isColliding(marioRect, obstacleRect)) {
        return this.stop('Game Over!');
      } else if (this.isPassed(marioRect, obstacleRect)) {
        this.lastPassedObstacle !== obstacle && this.addScore();
        this.lastPassedObstacle = obstacle;
      }
    }
    this.collisionFrameId = requestAnimationFrame(this.checkCollision);
  }

  isColliding(marioRect, obstacleRect) {
    /*
     * 수평 충돌 상활
     * Mario: |-----|
     * Obstacle:   |-----|
     * */
    const isHorizontalOverlap =
      marioRect.left < obstacleRect.right && // 마리오가 장애물 오른쪽에서 겹치는 경우 검사
      marioRect.right > obstacleRect.left; // 마리오가 장애믈 왼쪽에서 겹치는 경우 검사

    const isVerticalOverlap =
      marioRect.top < obstacleRect.bottom && // 마리오가 장애물 아래에서 겹치는 경우 검사
      marioRect.bottom > obstacleRect.top; // 마리오가 장애물 위에서 겹치는 경우 검사

    return isHorizontalOverlap && isVerticalOverlap;
  }

  isPassed(marioRect, obstacleRect) {
    return marioRect.left > obstacleRect.right; // 마리오가 장애물 넘었는지 확인
  }
}

export default Game;

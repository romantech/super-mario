import Mario from './mario.js';
import Background from './background.js';
import ObstacleManager from './obstacle.js';
import DomManager from './domManager.js';

class Game {
  constructor() {
    this.mario = new Mario();
    this.background = new Background();
    this.obstacles = new ObstacleManager();

    this.score = 0;
    this.isPlaying = false;
    this.obstacleTimerId = null;
    this.collisionFrameId = null;
    this.lastObstaclePassed = null;

    // 동일한 참조의 이벤트 핸들러를 사용해야 이벤트를 제거할 수 있으므로 this.handleKeyDown 메서드 바인딩
    this.handleKeyDown = this.handleKeyDown.bind(this);
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
    this.checkCollision();
    this.scheduleAddObstacle();

    document.addEventListener('keydown', this.handleKeyDown);
  }

  stop(message = '') {
    this.isPlaying = false;

    this.background.stop();
    this.obstacles.stopAll();
    cancelAnimationFrame(this.collisionFrameId);
    clearInterval(this.obstacleTimerId);

    document.removeEventListener('keydown', this.handleKeyDown);

    if (message) setTimeout(() => alert(message));
  }

  scheduleAddObstacle() {
    const randomInterval = Math.floor(Math.random() * (2000 - 700 + 1)) + 700;
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
        this.lastObstaclePassed !== obstacle && this.addScore();
        this.lastObstaclePassed = obstacle;
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
    // 마리오가 장애물을 넘어갔는지 확인
    return marioRect.left > obstacleRect.right;
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

import {
  AudioManager,
  Background,
  DomManager,
  EntityManager,
  EventHandler,
  generateRandomNumber,
  Mario,
  Score,
} from './index.js';

class Game {
  static DEFAULT_SPEED = 5;
  static DEFAULT_BOTTOM = 50;

  isPlaying = false;
  obstacleTimerId = null;
  collisionFrameId = null;
  lastPassedObstacle = null;

  audio;
  score;
  mario;
  background;
  entityList;
  eventHandler;

  constructor({
    speed = Game.DEFAULT_SPEED,
    defaultBottom = Game.DEFAULT_BOTTOM,
  } = {}) {
    this.audio = new AudioManager();
    this.score = new Score();
    this.background = new Background({ speed });
    this.entityList = new EntityManager({ speed, defaultBottom });
    this.mario = new Mario({ defaultBottom, audio: this.audio });
    this.eventHandler = new EventHandler(this);

    // 동일한 참조의 이벤트 핸들러를 사용해야 이벤트를 제거할 수 있으므로 this.handleKeyDown 메서드 바인딩
    this.checkCollision = this.checkCollision.bind(this);
    this.initializeController();
  }

  initializeController() {
    DomManager.stopButton.onclick = () => this.stop();
    DomManager.startButton.onclick = () => this.start();
    DomManager.restartButton.onclick = () => this.restart();

    DomManager.audioToggle.onclick = () => {
      if (this.audio.isMuted) this.audio.unmute();
      else this.audio.mute();
    };
  }

  toggleButtonActive(shouldRestart) {
    DomManager.startButton.disabled = shouldRestart;
    DomManager.stopButton.disabled = shouldRestart;
    DomManager.restartButton.disabled = !shouldRestart;
  }

  reset() {
    this.entityList.reset();
    this.background.reset();
    this.score.reset();
  }

  restart() {
    this.reset();
    this.start();
    this.toggleButtonActive(false);
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.mario.run();
    this.entityList.moveAll();
    this.background.move();
    this.eventHandler.setupEventListeners();
    this.checkCollision();
    this.scheduleAddEntity();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    this.mario.stop();
    this.entityList.stopAll();
    this.background.stop();
    this.eventHandler.removeEventListeners();
    cancelAnimationFrame(this.collisionFrameId);
    clearInterval(this.obstacleTimerId);
  }

  failed() {
    this.stop();
    this.score.updateDialogScore();
    DomManager.dialog.showModal();
  }

  scheduleAddEntity() {
    const randomInterval = generateRandomNumber(600, 1800);
    this.obstacleTimerId = setTimeout(() => {
      const entityType = generateRandomNumber(0, 1) === 0 ? 'coin' : 'obstacle';
      this.entityList.add(entityType);
      if (this.isPlaying) this.scheduleAddEntity();
    }, randomInterval);
  }

  checkCollision() {
    for (let entity of this.entityList.list) {
      const marioRect = this.mario.element.getBoundingClientRect();
      const entityRect = entity.element.getBoundingClientRect();

      if (this.isColliding(marioRect, entityRect)) {
        if (entity.type === 'obstacle') {
          this.toggleButtonActive(true);
          return this.failed();
        } else if (entity.type === 'coin') {
          this.audio.playEffect('coin');
          this.score.add(entity.point);
          this.entityList.remove(entity);
        }
      }
    }

    this.collisionFrameId = requestAnimationFrame(this.checkCollision);
  }

  isColliding(marioRect, entityRect) {
    /*
     * 수평 충돌 상활
     * Mario: |-----|
     * Obstacle:   |-----|
     * */
    const isHorizontalOverlap =
      marioRect.left < entityRect.right && // 마리오가 장애물 오른쪽에서 겹치는 경우 검사
      marioRect.right > entityRect.left; // 마리오가 장애물 왼쪽에서 겹치는 경우 검사

    const isVerticalOverlap =
      marioRect.top < entityRect.bottom && // 마리오가 장애물 아래에서 겹치는 경우 검사
      marioRect.bottom > entityRect.top; // 마리오가 장애물 위에서 겹치는 경우 검사

    return isHorizontalOverlap && isVerticalOverlap;
  }

  isPassed(marioRect, obstacleRect) {
    return marioRect.left > obstacleRect.right; // 마리오가 장애물 넘었는지 확인
  }
}

export default Game;

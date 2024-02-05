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

  audio;
  score;
  mario;
  background;
  entityManager;
  eventHandler;

  constructor({
    speed = Game.DEFAULT_SPEED,
    bottom = Game.DEFAULT_BOTTOM,
  } = {}) {
    this.audio = new AudioManager();
    this.score = new Score();
    this.background = new Background({ speed });
    this.entityManager = new EntityManager({ speed, bottom });
    this.mario = new Mario({ bottom });
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
    this.entityManager.reset();
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
    this.entityManager.moveAll();
    this.background.move();
    this.eventHandler.setupEventListeners();
    this.checkCollision();
    this.scheduleAddEntity();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    this.mario.stop();
    this.entityManager.stopAll();
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
      const entityTypesLen = EntityManager.ENTITY_TYPES.length;
      const idx = generateRandomNumber(0, entityTypesLen - 1);
      const entityType = EntityManager.ENTITY_TYPES[idx];

      if (entityType === 'both') {
        this.entityManager.add('coin', true);
        this.entityManager.add('obstacle');
      } else {
        this.entityManager.add(entityType);
      }

      if (this.isPlaying) this.scheduleAddEntity();
    }, randomInterval);
  }

  checkCollision() {
    const marioRect = this.mario.element.getBoundingClientRect();

    for (let entity of this.entityManager.list) {
      const entityRect = entity.element.getBoundingClientRect();

      if (!entity.touched && this.isColliding(marioRect, entityRect)) {
        switch (entity.type) {
          case 'obstacle': {
            this.toggleButtonActive(true);
            this.failed();
            return; // checkCollision() 반복 호출 종료
          }
          case 'coin': {
            this.audio.playEffect('coin');
            this.score.add(entity.point);
            entity.touched = true;
            entity.hide();
          }
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
}

export default Game;

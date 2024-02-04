import DomManager from './dom-manager.js';
import { generateRandomNumber } from './utils.js';

class EntityManager {
  static ENTITY_TYPES = ['obstacle', 'coin', 'both'];

  list = new Set();
  frameId = null;
  isMonitoring = false;
  option;

  constructor(option) {
    this.option = option;
  }

  add(objectType, withObstacle = false) {
    let entity;

    switch (objectType) {
      case 'obstacle': {
        entity = new Obstacle(this.option);
        break;
      }
      case 'coin': {
        entity = new Coin(this.option, withObstacle);
        break;
      }
    }

    DomManager.gameArea.appendChild(entity.element);
    this.list.add(entity);
    entity.move();
  }

  remove(entity) {
    entity.stop();
    entity.element.remove();
    this.list.delete(entity);
  }

  reset() {
    this.list.forEach(entity => this.remove(entity));
  }

  offScreenMonitor() {
    const checkObstacles = () => {
      this.list.forEach(entity => {
        if (entity.isOutOfBounds) this.remove(entity);
      });

      if (this.isMonitoring) {
        this.frameId = requestAnimationFrame(checkObstacles);
      }
    };

    checkObstacles();
  }

  moveAll() {
    this.list.forEach(entity => entity.move());
    if (!this.isMonitoring) {
      this.isMonitoring = true;
      this.offScreenMonitor();
    }
  }

  stopAll() {
    this.list.forEach(entity => entity.stop());
    if (this.isMonitoring) {
      cancelAnimationFrame(this.frameId);
      this.isMonitoring = false;
    }
  }
}

class Entity {
  constructor({ bottom, speed, className }) {
    this.speed = speed;
    this.frameId = null;
    this.point = 0;

    this.element = document.createElement('div');
    this.element.classList.add(className);
    this.element.style.bottom = bottom + 'px';
    this.element.style.right = '-100px'; // 장애물 생성을 자연스럽게 하기 위해 초기값을 더 오른쪽으로 지정

    this.move = this.move.bind(this);
  }

  get isOutOfBounds() {
    // 장애물이 게임 화면 왼쪽 경계를 벗어나면 제거
    // element.clientWidth 값은 요소의 내부 너비(padding 포함)
    return this.currentPosition >= DomManager.gameArea.clientWidth;
  }

  get currentPosition() {
    return parseInt(this.element.style.right, 10); // parseInt('10.5px') => 10
  }

  move() {
    const nextRight = this.currentPosition + this.speed;
    this.element.style.right = nextRight + 'px'; // 장애물을 왼쪽으로 이동
    this.frameId = requestAnimationFrame(this.move);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }
}

class Obstacle extends Entity {
  static GOOMBA_IMG_PATH = './assets/goomba.png';
  static PIRANHA_IMG_PATH = './assets/piranha.png';

  constructor(option) {
    super({ ...option, className: 'obstacle' });

    const imgSet = [Obstacle.GOOMBA_IMG_PATH, Obstacle.PIRANHA_IMG_PATH];
    const imgPath = imgSet[generateRandomNumber(0, imgSet.length - 1)];

    this.type = 'obstacle';
    this.element.style.backgroundImage = `url(${imgPath})`;
  }
}

class Coin extends Entity {
  static IMG_PATH = './assets/coin.png';
  static POINT_EASY = 1;
  static POINT_MEDIUM = 5;

  constructor(option, withObstacle) {
    const minBottom = withObstacle ? option.bottom + 100 : option.bottom;

    super({
      ...option,
      className: 'coin',
      bottom: generateRandomNumber(minBottom, 240),
    });

    this.element.style.backgroundImage = `url(${Coin.IMG_PATH})`;
    this.point = withObstacle ? Coin.POINT_MEDIUM : Coin.POINT_EASY;
    this.type = 'coin';
  }
}

export default EntityManager;

import DomManager from './dom-manager.js';

class ObstacleManager {
  list = new Set();
  frameId = null;
  isMonitoring = false;

  add() {
    const obstacle = new Obstacle();
    this.list.add(obstacle);
    DomManager.gameArea.appendChild(obstacle.element);
    obstacle.move();
  }

  remove(obstacle) {
    obstacle.stop();
    obstacle.element.remove();
    this.list.delete(obstacle);
  }

  reset() {
    this.list.forEach(obstacle => this.remove(obstacle));
  }

  offScreenMonitor() {
    const checkObstacles = () => {
      this.list.forEach(obstacle => {
        if (obstacle.isOutOfBounds) this.remove(obstacle);
      });

      if (this.isMonitoring) {
        this.frameId = requestAnimationFrame(checkObstacles);
      }
    };

    checkObstacles();
  }

  moveAll() {
    this.list.forEach(obstacle => obstacle.move());
    if (!this.isMonitoring) {
      this.isMonitoring = true;
      this.offScreenMonitor();
    }
  }

  stopAll() {
    this.list.forEach(obstacle => obstacle.stop());
    if (this.isMonitoring) {
      cancelAnimationFrame(this.frameId);
      this.isMonitoring = false;
    }
  }
}

class Obstacle {
  constructor({ defaultBottom, speed, className = 'obstacle' } = {}) {
    this.speed = speed;
    this.point = 1;
    this.frameId = null;

    this.element = document.createElement('div');
    this.element.classList.add(className);
    this.element.style.bottom = defaultBottom + 'px';
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

export default ObstacleManager;

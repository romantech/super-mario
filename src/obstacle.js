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
  constructor({ defaultBottom = 50, className = 'obstacle', speed = 5 } = {}) {
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
    // 장애물이 왼쪽 끝에 도달하면 제거. window.innerWidth 값은 스크롤바를 포함한 뷰포트 사이즈
    return this.currentPosition >= window.innerWidth;
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

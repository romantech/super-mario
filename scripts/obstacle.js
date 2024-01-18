import DomManager from './domManager.js';

class Obstacles {
  constructor() {
    this.list = new Set();
  }

  add() {
    const obstacle = new Obstacle();
    this.list.add(obstacle);
    DomManager.gameArea.appendChild(obstacle.element);
    obstacle.move();
  }

  moveAll() {
    this.list.forEach(obstacle => obstacle.move());
  }

  stopAll() {
    this.list.forEach(obstacle => obstacle.stop());
  }
}

class Obstacle {
  constructor({ defaultBottom = 50, className = 'obstacle', speed = 5 } = {}) {
    this.speed = speed;
    this.element = document.createElement('div');
    this.element.classList.add(className);
    this.element.style.bottom = defaultBottom + 'px';
    this.frameId = null;
    this.element.style.right = '0px'; // 게임 영역 오른쪽 끝으로 장애물 초기 위치 지정

    this.move = this.move.bind(this); // move 메소드 바인딩
  }

  get isInside() {
    // 장애물이 왼쪽 끝에 도달하면 제거. window.innerWidth 값은 스크롤바를 포함한 뷰포트 사이즈
    return this.currentRight < window.innerWidth;
  }

  get currentRight() {
    return parseInt(this.element.style.right); // parseInt('10px') => 10
  }

  move() {
    const nextRight = this.currentRight + this.speed;
    this.element.style.right = nextRight + 'px'; // 장애물을 왼쪽으로 이동

    if (!this.isInside) this.element.remove();
    else this.frameId = requestAnimationFrame(this.move);
  }

  stop() {
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }
}

export default Obstacles;

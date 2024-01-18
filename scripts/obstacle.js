const $gameArea = document.querySelector('.game');
const SPEED = 5;
let obstacles = [];

class Obstacle {
  constructor(defaultBottom = 50, className = 'obstacle') {
    this.element = document.createElement('div');
    this.element.classList.add(className);
    this.element.style.bottom = defaultBottom + 'px';
    this.element.style.right = '0px'; // 게임 영역 오른쪽 끝으로 장애물 초기 위치 지정
    $gameArea.appendChild(this.element);
    obstacles.push(this);
  }

  move() {
    let currentRight = parseInt(this.element.style.right); // parseInt('10px') => 10
    currentRight += SPEED; // 장애물을 왼쪽으로 이동
    this.element.style.right = currentRight + 'px';

    // 장애물이 왼쪽 끝에 도달하면 제거. window.innerWidth는 스크롤바를 포함한 뷰포트 사이즈
    if (currentRight > window.innerWidth) {
      this.element.remove();
      obstacles = obstacles.filter(obstacle => obstacle !== this);
    } else requestAnimationFrame(this.move.bind(this));
  }
}

const createObstacle = () => {
  const obstacle = new Obstacle();
  obstacle.move();
};

export { Obstacle, createObstacle, obstacles };

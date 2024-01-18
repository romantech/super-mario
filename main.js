import {
  createObstacle,
  Mario,
  moveBackground,
  obstacles,
  stopGame,
} from './scripts';

const mario = new Mario();
let obstacleTimerId = null;

const isColliding = (mario, obstacle) => {
  const marioRect = mario.element.getBoundingClientRect();
  const obstacleRect = obstacle.element.getBoundingClientRect();

  return (
    marioRect.left < obstacleRect.right &&
    marioRect.right > obstacleRect.left &&
    marioRect.top < obstacleRect.bottom &&
    marioRect.bottom > obstacleRect.top
  );
};

const checkCollision = () => {
  let frameId = null;
  for (let obstacle of obstacles) {
    if (isColliding(mario, obstacle)) {
      alert('충돌 발생! 게임 오버');
      stopGame();
      cancelAnimationFrame(frameId);
      clearInterval(obstacleTimerId);
      return; // 충돌 발생 시 루프를 중단
    }
  }
  frameId = requestAnimationFrame(checkCollision); // 계속해서 충돌 감지
};

window.onload = function () {
  moveBackground();
  obstacleTimerId = setInterval(createObstacle, 2500);
  requestAnimationFrame(checkCollision); // 충돌 감지 시작

  document.addEventListener('keydown', e => {
    if (e.code === 'Space') mario.jump();
  });
};

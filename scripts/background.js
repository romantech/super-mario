const $gameArea = document.querySelector('.game');
const SPEED = 5;
let backgroundPositionX = 0;
let frameId = null;

const moveBackground = () => {
  backgroundPositionX -= SPEED;
  $gameArea.style.backgroundPositionX = backgroundPositionX + 'px'; // 배경 이미지의 가로 위치 지정
  frameId = requestAnimationFrame(moveBackground);
};

const stopGame = () => {
  cancelAnimationFrame(frameId);
  frameId = null;
};

export { moveBackground, stopGame };

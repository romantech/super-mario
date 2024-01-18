const $gameArea = document.querySelector('.game');
const $score = document.querySelector('.score');

const addScore = () => {
  const nextScore = parseInt($score.textContent) + 1;
  $score.textContent = String(nextScore);
};

class Mario {
  static maxHeight = 250;
  static jumpHeight = 10;

  constructor(defaultBottom = 50, className = 'mario') {
    this.element = document.createElement('div');
    this.element.classList.add(className);
    this.defaultBottom = defaultBottom;
    this.element.style.bottom = defaultBottom + 'px';
    this.isJumping = false;
    $gameArea.appendChild(this.element);
  }

  jump() {
    if (this.isJumping) return; // 이미 점프 중이면 추가 점프를 방지

    this.isJumping = true;
    let jumpCount = 0;

    const down = () => {
      const nextBottom = this.defaultBottom + --jumpCount * Mario.jumpHeight;
      this.element.style.bottom = nextBottom + 'px';
      if (nextBottom > this.defaultBottom) requestAnimationFrame(down);
      else {
        this.isJumping = false;
        addScore();
      }
    };

    const up = () => {
      const nextBottom = this.defaultBottom + ++jumpCount * Mario.jumpHeight;
      this.element.style.bottom = nextBottom + 'px';
      requestAnimationFrame(nextBottom < Mario.maxHeight ? up : down);
    };

    up();
  }
}

export default Mario;

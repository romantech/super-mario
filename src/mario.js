import DomManager from './dom-manager.js';

class Mario {
  static jumpHeight = 18;
  static gravity = 0.4; // 중력 가속도

  constructor({ defaultBottom, className = 'mario' }) {
    this.defaultBottom = defaultBottom;
    this.isJumping = false;

    this.element = document.createElement('img');
    this.element.src = '/assets/mario-stop.png';
    this.element.classList.add(className);
    this.element.style.bottom = defaultBottom + 'px';

    DomManager.gameArea.appendChild(this.element);
  }

  run() {
    // Github Page 에서 루트 폴더는 {username}.github.io 이므로 주소에 레포지토리 이름 추가
    this.element.src = 'super-mario/assets/mario-run.gif';
  }

  stop() {
    this.element.src = 'super-mario/assets/mario-stop.png';
  }

  jump() {
    if (this.isJumping) return;

    this.isJumping = true;
    let jumpCount = 0;
    let velocity = Mario.jumpHeight;

    const up = () => {
      jumpCount++;
      velocity = Math.max(velocity - Mario.gravity, 0);

      let nextBottom = jumpCount * velocity + this.defaultBottom;
      this.element.style.bottom = nextBottom + 'px';

      if (nextBottom > this.defaultBottom) requestAnimationFrame(up);
      else this.isJumping = false;
    };

    up();
  }
}

export default Mario;

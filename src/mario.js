import DomManager from './dom-manager.js';

class Mario {
  static jumpHeight = 18;
  static gravity = 0.4; // 중력 가속도

  stopImage = new Image();
  runImage = new Image();
  element = new Image();

  constructor({ defaultBottom, className = 'mario' }) {
    this.defaultBottom = defaultBottom;
    this.isJumping = false;

    // image.src 속성에 값을 할당하면 백그라운드에서 이미지 로드 시작
    this.stopImage.src = './assets/mario-stop.png';
    this.runImage.src = './assets/mario-run.gif';

    this.element.src = this.stopImage.src; // 이미 로드한 이미지를 캐시에서 가져옴
    this.element.classList.add(className);
    this.element.style.bottom = defaultBottom + 'px';

    DomManager.gameArea.appendChild(this.element);
  }

  run() {
    this.element.src = this.runImage.src;
  }

  stop() {
    this.element.src = this.stopImage.src;
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

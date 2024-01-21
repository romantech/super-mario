import DomManager from './dom-manager.js';

class Mario {
  static jumpHeight = 18; // 점프 높이. 높을수록 더 높이 점프
  static gravity = 0.4; // 중력 가속도. 낮을수록 더 오래 점프

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

    /**
     * 상승(Fast) -> 정점(Slow) -> 하강(Fast) 중력 작용이 유사하게 적용된 점프 메서드
     * count 1,  velocity 17.6, height 17.6 | 차이 18 -- 상승
     * count 5,  velocity 16,   height 80   | 차이 63
     * count 10, velocity 14,   height 140  | 차이 60 -- 느려지기 시작
     * count 15, velocity 12,   height 180  | 차이 40
     * count 20, velocity 10,   height 200  | 차이 20
     * count 22, velocity 9.2,  height 202  | 차이 2  -- 정점
     * count 25, velocity 8,    height 200  | 차이 2  -- 하강
     * count 30, velocity 6,    height 180  | 차이 20 -- 빨라지기 시작
     * count 35, velocity 4,    height 140  | 차이 40
     * count 40, velocity 2,    height 80   | 차이 60
     * count 45, velocity 0,    height 0    | 차이 80
     * */
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

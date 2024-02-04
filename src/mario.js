import DomManager from './dom-manager.js';
import { loadImages } from './utils.js';

class Mario {
  static JUMP_HEIGHT = 18; // 점프 높이. 높을수록 더 높이 점프
  static GRAVITY = 0.4; // 중력 가속도. 낮을수록 더 오래 점프
  static STOP_IMAGE_PATH = './assets/mario-stop.png';
  static RUN_IMAGE_PATH = './assets/mario-run.gif';

  stopImage = new Image();
  runImage = new Image();
  element = new Image();

  bottom;
  isJumping = false;

  constructor({ bottom, className = 'mario' }) {
    this.bottom = bottom;

    this.preloadImages()
      .then(() => this.initializeImage(className))
      .catch(error => console.error('Error initializing Mario:', error));
  }

  initializeImage(className) {
    this.element.src = this.stopImage.src;
    this.element.classList.add(className);
    this.element.style.bottom = this.bottom + 'px';
    DomManager.gameArea.appendChild(this.element);
  }

  async preloadImages() {
    const srcset = [Mario.STOP_IMAGE_PATH, Mario.RUN_IMAGE_PATH];
    try {
      const [stopImage, runImage] = await loadImages(srcset);
      this.stopImage.src = stopImage.src;
      this.runImage.src = runImage.src;
    } catch (error) {
      console.error('Error preloading Mario images:', error);
    }
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
    let velocity = Mario.JUMP_HEIGHT;

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
      velocity = Math.max(velocity - Mario.GRAVITY, 0);

      let nextBottom = jumpCount * velocity + this.bottom;
      this.element.style.bottom = nextBottom + 'px';

      if (nextBottom > this.bottom) requestAnimationFrame(up);
      else this.isJumping = false;
    };

    up();
  }
}

export default Mario;

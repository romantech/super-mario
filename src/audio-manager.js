import DomManager from './dom-manager.js';
import { loadImages } from './utils.js';

class AudioManager {
  static SOUND_ON_PATH = './assets/sound-on.png';
  static SOUND_OFF_PATH = './assets/sound-off.png';
  static JUMP_SOUND_PATH = './assets/audio/jump-sound.mp3';
  static BGM_PATH = './assets/audio/bgm.mp3';

  soundOnImage = new Image();
  soundOffImage = new Image();

  audio = new Audio(AudioManager.BGM_PATH);
  jumpSound = new Audio(AudioManager.JUMP_SOUND_PATH);

  constructor({ autoplay = true, loop = true, muted = true } = {}) {
    this.audio.autoplay = autoplay;
    this.audio.loop = loop;
    this.audio.muted = muted;

    this.preloadImages();
  }

  get isMuted() {
    return this.audio.muted;
  }

  set isMuted(value) {
    this.audio.muted = value;
  }

  async preloadImages() {
    const srcset = [AudioManager.SOUND_ON_PATH, AudioManager.SOUND_OFF_PATH];
    try {
      const [soundOn, soundOff] = await loadImages(srcset);
      this.soundOnImage.src = soundOn.src;
      this.soundOffImage.src = soundOff.src;
    } catch (error) {
      console.error('Error preloading audio images:', error);
    }
  }

  playJumpSound() {
    if (this.isMuted) return;
    this.jumpSound.currentTime = 0; // 재생 위치를 처음으로 설정
    this.jumpSound.play();
  }

  #toggleIcon() {
    const src = this.isMuted
      ? AudioManager.SOUND_OFF_PATH
      : AudioManager.SOUND_ON_PATH;
    DomManager.audioToggle.style.backgroundImage = `url(${src})`;
  }

  mute() {
    this.isMuted = true;
    this.#toggleIcon();
  }

  unmute() {
    this.isMuted = false;
    this.#toggleIcon();
  }
}

export default AudioManager;

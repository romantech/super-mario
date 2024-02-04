import DomManager from './dom-manager.js';
import { loadImages } from './utils.js';

class AudioManager {
  static SOUND_ON_PATH = './assets/sound-on.png';
  static SOUND_OFF_PATH = './assets/sound-off.png';
  static JUMP_SOUND_PATH = './assets/audio/jump.mp3';
  static COIN_SOUND_PATH = './assets/audio/coin.mp3';
  static BGM_PATH = './assets/audio/bgm.mp3';

  soundOnImage = new Image();
  soundOffImage = new Image();

  audio = new Audio(AudioManager.BGM_PATH);
  jumpSound = new Audio(AudioManager.JUMP_SOUND_PATH);
  coinSound = new Audio(AudioManager.COIN_SOUND_PATH);

  constructor({ autoplay = true, loop = true, muted = true } = {}) {
    this.audio.autoplay = autoplay;
    this.audio.loop = loop;
    this.audio.muted = muted;

    this.jumpSound.volume = 0.5;
    this.jumpSound.playbackRate = 2;

    this.coinSound.volume = 0.5;
    this.coinSound.playbackRate = 2;

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

  playEffect(type) {
    if (this.isMuted) return;

    let sound;
    switch (type) {
      case 'jump': {
        sound = this.jumpSound;
        break;
      }
      case 'coin': {
        sound = this.coinSound;
        break;
      }
    }

    sound.currentTime = 0; // 재생 위치를 처음으로 설정
    sound.play();
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

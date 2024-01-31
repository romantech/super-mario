import DomManager from './dom-manager.js';
import { loadImages } from './utils.js';

class AudioManager {
  soundOnImage = new Image();
  soundOffImage = new Image();

  constructor({
    filePath = './assets/mario-bgm.mp3',
    iconSources = ['./assets/sound-on.png', './assets/sound-off.png'],
    autoplay = true,
    loop = true,
    muted = true,
  } = {}) {
    this.audio = new Audio(filePath);
    this.audio.autoplay = autoplay;
    this.audio.loop = loop;
    this.audio.muted = muted;
    this.iconSources = iconSources;

    this.audio.onerror = () => {
      console.error('Failed to load audio:', filePath);
    };

    this.preloadImages();
  }

  get isMuted() {
    return this.audio.muted;
  }

  set isMuted(value) {
    this.audio.muted = value;
  }

  async preloadImages() {
    try {
      const [soundOn, soundOff] = await loadImages(this.iconSources);
      this.soundOnImage.src = soundOn.src;
      this.soundOffImage.src = soundOff.src;
    } catch (error) {
      console.error(error);
    }
  }

  #toggleIcon() {
    const src = this.isMuted ? this.iconSources[1] : this.iconSources[0];
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

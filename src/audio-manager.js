import DomManager from './dom-manager.js';

class AudioManager {
  constructor({
    filePath = './assets/mario-bgm.mp3',
    autoplay = true,
    loop = true,
    muted = true,
  } = {}) {
    this.audio = new Audio(filePath);
    this.audio.autoplay = autoplay;
    this.audio.loop = loop;
    this.audio.muted = muted;

    this.audio.onerror = () => {
      console.error('Failed to load audio:', filePath);
    };
  }

  #toggleIcon() {
    const src = `./assets/sound-${this.audio.muted ? 'off' : 'on'}.png`;
    DomManager.audioToggle.style.backgroundImage = `url(${src})`;
  }

  mute() {
    this.audio.muted = true;
    this.#toggleIcon();
  }

  unmute() {
    this.audio.muted = false;
    this.#toggleIcon();
  }
}

export default AudioManager;

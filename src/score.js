import DomManager from './dom-manager.js';

class Score {
  #score = 0;

  get score() {
    return this.#score;
  }

  set score(value) {
    this.#score = value;
    this.updateDisplay();
  }

  add(points) {
    this.score += points;
    this.updateDisplay();
  }

  reset() {
    this.score = 0;
    this.updateDisplay();
  }

  updateDisplay() {
    DomManager.score.textContent = String(this.score);
  }
}

export default Score;

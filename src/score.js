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

  animateScore(element) {
    element.style.transform = 'scale(1.5)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 300);
  }

  updateDialogScore() {
    DomManager.dialogScore.textContent = String(this.score);
  }

  updateDisplay() {
    DomManager.score.textContent = String(this.score);
    if (this.score > 0) this.animateScore(DomManager.score);
  }
}

export default Score;

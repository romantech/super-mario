import { DomManager, Game } from './src/index.js';

const init = () => {
  const game = new Game();

  DomManager.stopButton.onclick = () => game.stop();
  DomManager.startButton.onclick = () => game.start();
};

window.onload = init;

import { DomManager, Game } from './src/index.js';

const init = () => {
  const game = new Game({ defaultBottom: 50, speed: 5 });

  DomManager.stopButton.onclick = () => game.stop();
  DomManager.startButton.onclick = () => game.start();
};

window.onload = init;

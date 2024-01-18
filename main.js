import { DomManager, Game } from './scripts';

const init = () => {
  const game = new Game();

  DomManager.stopButton.addEventListener('click', () => {
    game.stop();
  });

  DomManager.startButton.addEventListener('click', () => {
    game.start();
  });
};

window.onload = init;

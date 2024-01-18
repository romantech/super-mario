import { Game } from './scripts';

const init = () => {
  const game = new Game();
  game.start();
};

window.onload = init;

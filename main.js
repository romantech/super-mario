import { Game } from './src/index.js';

const init = () => {
  const game = new Game({ defaultBottom: 50, speed: 5 });
};

window.onload = init;

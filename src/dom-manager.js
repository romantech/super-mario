class DomManager {
  gameArea = document.querySelector('.game');
  score = document.querySelector('.score');
  stopButton = document.querySelector('.stop-button');
  startButton = document.querySelector('.start-button');
  restartButton = document.querySelector('.restart-button');
}

// 프로젝트에서 동일한 DomManager 인스턴스에 접근할 수 있도록 싱글톤으로 export
export default new DomManager();

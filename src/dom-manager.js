class DomManager {
  gameArea = document.querySelector('.game');
  scores = document.querySelectorAll('.score');
  stopButton = document.querySelector('.button-stop');
  startButton = document.querySelector('.button-start');
  restartButton = document.querySelector('.button-restart');
  dialog = document.querySelector('.dialog-failed');
}

// 프로젝트에서 동일한 DomManager 인스턴스에 접근할 수 있도록 싱글톤으로 export
export default new DomManager();

class DomManager {
  constructor() {
    this.gameArea = document.querySelector('.game');
    this.score = document.querySelector('.score');
    this.stopButton = document.querySelector('.stop-button');
    this.startButton = document.querySelector('.start-button');
    this.restartButton = document.querySelector('.restart-button');
  }
}

// 프로젝트에서 동일한 DomManager 인스턴스에 접근할 수 있도록 싱글톤 패턴으로 export
export default new DomManager();

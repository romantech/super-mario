class DomManager {
  static instance = null;

  constructor() {
    // 생성자 함수는 기본적으로 새로 생성된 인스턴스(this)를 반환하지만 명시적으로 반환 값을 지정할 수도 있다
    if (DomManager.instance) return DomManager.instance;

    this.gameArea = document.querySelector('.game');
    this.dialog = document.querySelector('.dialog-failed');
    this.score = document.querySelector('.score');
    this.dialogScore = document.querySelector('.score-dialog');

    this.stopButton = document.querySelector('.button-stop');
    this.startButton = document.querySelector('.button-start');
    this.restartButton = document.querySelector('.button-restart');
    this.audioToggle = document.querySelector('.audio-toggle');

    DomManager.instance = this;
  }

  static getInstance() {
    // getInstance()를 처음 호출하면 생성자 함수를 실행해서 새로운 인스턴스를 만들고 DomManager.instance에 할당한다
    // 그 후 getInstance()를 다시 호출하면 DomManager.instance 정적 프로퍼티에 할당했던 기존 인스턴스를 반환한다
    if (!DomManager.instance) DomManager.instance = new DomManager();
    return DomManager.instance;
  }
}

// 프로젝트에서 동일한 DomManager 인스턴스에 접근할 수 있도록 싱글톤으로 export
export default DomManager.getInstance();

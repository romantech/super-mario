class DomManager {
  constructor() {
    this.gameArea = document.querySelector('.game');
    this.score = document.querySelector('.score');
  }

  get getGameArea() {
    return this.gameArea;
  }

  get getScore() {
    return this.score;
  }
}

export default new DomManager(); // 싱글톤 인스턴스로 내보내기

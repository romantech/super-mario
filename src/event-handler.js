import DomManager from './dom-manager.js';

export default class EventHandler {
  constructor(game) {
    this.game = game;
    // 동일한 참조의 이벤트 핸들러를 사용해야 이벤트를 제거할 수 있으므로 this.handleKeyDown 메서드 바인딩
    this.handleJump = this.handleJump.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.handleJump);
    DomManager.dialog.addEventListener('close', this.handleDialogClose);
    DomManager.gameArea.addEventListener('touchstart', this.handleJump, {
      passive: false, // event.preventDefault() 호출할 것이라고 브라우저에게 알림
    });
  }

  removeEventListeners() {
    document.removeEventListener('keydown', this.handleJump);
    DomManager.gameArea.removeEventListener('touchstart', this.handleJump);
  }

  handleDialogClose(e) {
    if (e.target.returnValue === 'restart') this.game.restart();
  }

  handleJump(e) {
    const isSpaceKeyPressed = e instanceof KeyboardEvent && e.code === 'Space';
    // 데스크톱 사파리에서 e instanceof TouchEvent 사용하면 아래 에러 발생 TouchEvent 찾을 수 없다는 에러 발생
    // 따라서 'touches' in e 코드로 모바일 여부 판단
    const isTouchEvent = 'touches' in e && e.type === 'touchstart';

    if (isSpaceKeyPressed || isTouchEvent) {
      // "시작" 버튼을 누르면 버튼에 포커스된 상태가 되고,
      // 스페이스를 누르면 기본 동작으로 인해 시작 버튼이 클릭되는 문제 있음
      // preventDefault()를 이용해 기본 동작을 해제하면 문제 발생 안함
      e.preventDefault();

      // 모바일에선 점프, 코인 사운드를 둘다 재생하면 살짝 끊김 현상해서 점프 소리 비활성
      !isTouchEvent && this.game.audio.playEffect('jump');
      this.game.mario.jump();
    }
  }
}

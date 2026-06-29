export class GameModel {
  balance = 1000;
  bet = 10;
  win = 0;

  readonly availableBets = [10, 20, 50, 100];

  setBet(value: number) {
    if (this.availableBets.includes(value)) {
      this.bet = value;
    }
  }

  canSpin() {
    return this.balance >= this.bet;
  }

  startSpin() {
    if (!this.canSpin()) return false;

    this.balance -= this.bet;
    this.win = 0;

    return true;
  }

  applySpinResult(win: number) {
    this.win = win;
    this.balance += win;
  }
}

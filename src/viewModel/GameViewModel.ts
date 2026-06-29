import { GameModel } from "../domain/GameModel";

export type GamePhase = "idle" | "spinning" | "showingWin";

type Listener = () => void;

export class GameViewModel {
  private listeners: Listener[] = [];

  phase: GamePhase = "idle";
  spinRequested = false;
  stopRequested = false;
  autoSpinRequested = false;
  autoSpinsLeft = 0;

  symbols: string[][] = [];
  message = "";

  constructor(public model: GameModel) {}

  subscribe(listener: Listener) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  get balance() {
    return this.model.balance;
  }

  get bet() {
    return this.model.bet;
  }

  get win() {
    return this.model.win;
  }

  get availableBets() {
    return this.model.availableBets;
  }

  get canSpin() {
    return this.phase === "idle" && this.model.canSpin();
  }

  get canStop() {
    return this.phase === "spinning";
  }

  setBet(value: number) {
    if (this.phase !== "idle") return;

    this.model.setBet(value);
    this.notify();
  }

  requestSpin() {
    if (!this.canSpin) return;

    this.spinRequested = true;
    this.notify();
  }

  requestStop() {
    if (!this.canStop) return;

    this.stopRequested = true;
    this.notify();
  }

  requestAutoSpin(count: number) {
    if (!this.canSpin) return;

    this.autoSpinRequested = true;
    this.autoSpinsLeft = count;
    this.spinRequested = true;
    this.notify();
  }

  stopAutoSpin() {
    this.autoSpinRequested = false;
    this.autoSpinsLeft = 0;
    this.stopRequested = true;
    this.notify();
  }

  setPhase(phase: GamePhase) {
    this.phase = phase;
    this.notify();
  }

  consumeSpinRequest() {
    this.spinRequested = false;
    this.notify();
  }

  consumeStopRequest() {
    this.stopRequested = false;
    this.notify();
  }
}

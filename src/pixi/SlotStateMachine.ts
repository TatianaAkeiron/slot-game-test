import { GameViewModel } from "../viewModel/GameViewModel";
import { getMockSpinResult } from "../mock/spinMock";
import { SlotScene } from "./SlotScene";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class SlotStateMachine {
  private isRunning = false;

  constructor(
    private scene: SlotScene,
    private vm: GameViewModel,
  ) {}

  async startSpin() {
    if (this.isRunning) return;
    if (!this.vm.model.startSpin()) return;

    this.isRunning = true;
    this.vm.consumeSpinRequest();

    this.vm.setPhase("spinning");
    this.scene.startReelAnimation();

    const result = getMockSpinResult();

    let elapsed = 0;
    const totalDuration = 1500;
    const step = 100;

    while (elapsed < totalDuration) {
      if (this.vm.stopRequested) {
        this.vm.consumeStopRequest();
        break;
      }

      await delay(step);
      elapsed += step;
    }

    // console.log("start spin");
    await this.scene.stopReelsByColumns(result.matrix);
    // console.log("stop finished");

    this.vm.symbols = result.matrix;

    this.vm.setPhase("showingWin");

    this.vm.model.applySpinResult(result.win);
    this.vm.notify();
    if (result.win > 0) {
      this.scene.highlightWinLine(1);
    }

    await delay(800);
    this.scene.clearWinHighlight();
    this.vm.setPhase("idle");

    this.isRunning = false;

    if (this.vm.autoSpinRequested) {
      this.vm.autoSpinsLeft -= 1;

      if (this.vm.autoSpinsLeft > 0 && this.vm.canSpin) {
        this.vm.requestSpin();
      } else {
        this.vm.autoSpinRequested = false;
        this.vm.autoSpinsLeft = 0;
        this.vm.notify();
      }
    }
  }
}

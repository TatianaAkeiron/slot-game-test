import * as PIXI from "pixi.js";
import { GameViewModel } from "../viewModel/GameViewModel";
import { SlotStateMachine } from "./SlotStateMachine";

const symbols = ["🍒", "🍋", "🔔", "⭐", "7"];
const cellColor = "#374151";
const winColor = "#facc15";
const borderColor = "#9ca3af";

export class SlotScene {
  private app: PIXI.Application;
  private cells: PIXI.Text[] = [];
  private cellBackgrounds: PIXI.Graphics[] = [];
  private stateMachine: SlotStateMachine;
  private isAnimating = false;
  private stoppedColumns = new Set<number>();

  constructor(private vm: GameViewModel) {
    this.app = new PIXI.Application();
    this.stateMachine = new SlotStateMachine(this, vm);
  }

  async init(container: HTMLElement) {
    await this.app.init({
      width: 700,
      height: 420,
      background: "#1f2937",
    });

    container.appendChild(this.app.canvas);

    this.createSlotGrid();

    this.app.ticker.add(() => {
      if (this.isAnimating) {
        this.animateRandomSymbols();
      }
    });

    this.vm.subscribe(() => {
      if (this.vm.spinRequested) {
        this.stateMachine.startSpin();
      }
    });
  }

  private drawCellBackground(graphics: PIXI.Graphics, color: string) {
    graphics.clear();

    graphics.rect(0, 0, 82, 82);
    graphics.fill(color);
    graphics.stroke({
      width: 2,
      color: borderColor,
    });
  }

  private createSlotGrid() {
    const startX = 100;
    const startY = 80;
    const cellSize = 90;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const graphics = new PIXI.Graphics();

        graphics.x = startX + col * cellSize;
        graphics.y = startY + row * cellSize;

        this.drawCellBackground(graphics, cellColor);

        this.app.stage.addChild(graphics);
        this.cellBackgrounds.push(graphics);

        const text = new PIXI.Text({
          text: symbols[Math.floor(Math.random() * symbols.length)],
          style: {
            fontSize: 42,
            fill: "#ffffff",
          },
        });

        text.anchor.set(0.5);
        text.x = startX + col * cellSize + cellSize / 2 - 4;
        text.y = startY + row * cellSize + cellSize / 2 - 4;

        this.cells.push(text);
        this.app.stage.addChild(text);
      }
    }
  }
  startReelAnimation() {
    this.stoppedColumns.clear();
    this.isAnimating = true;
  }

  highlightWinLine(rowIndex: number) {
    for (let col = 0; col < 5; col++) {
      const index = rowIndex * 5 + col;
      this.drawCellBackground(this.cellBackgrounds[index], winColor);

      const cell = this.cells[index];
      cell.scale.set(1.25);

      setTimeout(() => {
        cell.scale.set(1);
      }, 180);
    }
  }

  clearWinHighlight() {
    for (const background of this.cellBackgrounds) {
      this.drawCellBackground(background, cellColor);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async stopReelsByColumns(matrix: string[][]) {
    this.isAnimating = false;

    for (let col = 0; col < 5; col++) {
      await this.delay(180);

      this.stoppedColumns.add(col);
      for (let row = 0; row < 3; row++) {
        const index = row * 5 + col;
        const cell = this.cells[index];

        cell.text = matrix[row][col];

        cell.scale.set(1.3);

        setTimeout(() => {
          cell.scale.set(1);
        }, 120);
      }
    }
  }

  private animateRandomSymbols() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        if (this.stoppedColumns.has(col)) continue;

        const index = row * 5 + col;

        if (Math.random() > 0.7) {
          this.cells[index].text =
            symbols[Math.floor(Math.random() * symbols.length)];
        }
      }
    }
  }
}

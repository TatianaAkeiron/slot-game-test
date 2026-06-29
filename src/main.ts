import "./index.css";

import { GameModel } from "./domain/GameModel";
import { GameViewModel } from "./viewModel/GameViewModel";
import { createUI } from "./ui/createUI";
import { SlotScene } from "./pixi/SlotScene";

const root = document.querySelector<HTMLDivElement>("#app")!;

root.innerHTML = `
  <div class="layout">
    <div id="game"></div>
    <div id="ui"></div>
  </div>
`;

const model = new GameModel();
const vm = new GameViewModel(model);

const gameContainer = document.querySelector<HTMLDivElement>("#game")!;
const uiContainer = document.querySelector<HTMLDivElement>("#ui")!;

createUI(vm, uiContainer!);

const scene = new SlotScene(vm);
scene.init(gameContainer);

import { GameViewModel } from "../viewModel/GameViewModel";

export function createUI(vm: GameViewModel, mount: HTMLElement) {
  const container = document.createElement("div");

  container.innerHTML = `
    <div>
      <p>Balance: <span id="balance"></span></p>
      <p>Bet: <span id="bet"></span></p>
      <p>Win: <span id="win"></span></p>
      <p>Phase: <span id="phase"></span></p>

      <select id="betSelect"></select>

      <button id="spinBtn">Spin</button>
      <button id="stopBtn">Stop</button>
      <button id="autoBtn">Auto x5</button>
    </div>
  `;

  mount.appendChild(container);
  const balance = container.querySelector("#balance")!;
  const bet = container.querySelector("#bet")!;
  const win = container.querySelector("#win")!;
  const phase = container.querySelector("#phase")!;
  const betSelect = container.querySelector("#betSelect") as HTMLSelectElement;
  const spinBtn = container.querySelector("#spinBtn") as HTMLButtonElement;
  const stopBtn = container.querySelector("#stopBtn") as HTMLButtonElement;
  const autoBtn = container.querySelector("#autoBtn") as HTMLButtonElement;

  vm.availableBets.forEach((value) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    betSelect.appendChild(option);
  });

  spinBtn.onclick = () => vm.requestSpin();
  stopBtn.onclick = () => vm.requestStop();
  autoBtn.onclick = () => vm.requestAutoSpin(5);

  betSelect.onchange = () => vm.setBet(Number(betSelect.value));

  function render() {
    balance.textContent = String(vm.balance);
    bet.textContent = String(vm.bet);
    win.textContent = String(vm.win);
    phase.textContent = vm.phase;

    spinBtn.disabled = !vm.canSpin;
    stopBtn.disabled = !vm.canStop;
    autoBtn.disabled = !vm.canSpin;
    betSelect.disabled = vm.phase !== "idle";
    betSelect.value = String(vm.bet);
  }

  vm.subscribe(render);
  render();
}

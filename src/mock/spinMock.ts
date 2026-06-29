export type SpinResult = {
  matrix: string[][];
  win: number;
};

const symbols = ["🍒", "🍋", "🔔", "⭐", "7"];

export function getMockSpinResult(): SpinResult {
  const matrix = Array.from({ length: 3 }, () =>
    Array.from(
      { length: 5 },
      () => symbols[Math.floor(Math.random() * symbols.length)],
    ),
  );

  const win = Math.random() > 0.6 ? Math.floor(Math.random() * 100) + 10 : 0;

  return {
    matrix,
    win,
  };
}

export const buildFilters = (width: number) => {
  const FLOYD_STEINBERG = [
    [7 / 16, 1], // x + 1, y
    [3 / 16, width - 1], // x - 1, y + 1
    [5 / 16, width], // x, y + 1
    [1 / 16, width + 1], // x + 1, y + 1
  ];

  const JARVIS_JUDICS_NINKE = [
    [7 / 48, 1],
    [5 / 48, 2],
    [3 / 48, width - 2],
    [5 / 48, width - 1],
    [7 / 48, width],
    [5 / 48, width + 1],
    [3 / 48, width + 2],
    [1 / 48, (width * 2) - 2],
    [3 / 48, (width * 2) - 1],
    [5 / 48, (width * 2)],
    [3 / 48, (width * 2) + 1],
    [1 / 48, (width * 2) + 2],
  ];

  const STUCKI = [
    [8 / 42, 1],
    [4 / 42, 2],
    [2 / 42, width - 2],
    [4 / 42, width - 1],
    [8 / 42, width],
    [4 / 42, width + 1],
    [2 / 42, width + 2],
    [1 / 42, (width * 2) - 2],
    [2 / 42, (width * 2) - 1],
    [4 / 42, (width * 2)],
    [2 / 42, (width * 2) + 1],
    [1 / 42, (width * 2) + 2],
  ];

  const ATKINSON = [
    [1 / 8, 1],
    [1 / 8, 2],
    [1 / 8, width - 1],
    [1 / 8, width],
    [1 / 8, width + 1],
    [1 / 8, width * 2],
  ];

  const BURKES = [
    [8 / 32, 1],
    [4 / 32, 2],
    [2 / 32, width - 2],
    [4 / 32, width - 1],
    [8 / 32, width],
    [4 / 32, width + 1],
    [2 / 32, width + 2],
  ];

  const SIERRA = [
    [5 / 32, 1],
    [3 / 32, 2],
    [2 / 32, width - 2],
    [4 / 32, width - 1],
    [5 / 32, width],
    [4 / 32, width + 1],
    [2 / 32, width + 2],
    [2 / 32, (width * 2) - 1],
    [3 / 32, (width * 2)],
    [2 / 32, (width * 2) + 1],
  ];

  return [
    FLOYD_STEINBERG,
    JARVIS_JUDICS_NINKE,
    STUCKI,
    ATKINSON,
    BURKES,
    SIERRA,
  ];
}

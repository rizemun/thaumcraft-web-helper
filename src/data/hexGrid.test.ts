import {
  createRectangularGrid,
  createGridFromAscii,
  validateGrid,
  getCell,
  setCellState,
  HexGrid,
  HexCoord,
} from './hexGrid';

// Helper to check that a cell exists and has expected state
function expectCellState(
  grid: HexGrid,
  q: number,
  r: number,
  state: 'empty' | 'occupied' | 'blocked'
) {
  const cell = getCell(grid, { q, r });
  expect(cell).toBeDefined();
  expect(cell!.state).toBe(state);
}

describe('hexGrid', () => {
  describe('createRectangularGrid', () => {
    it('creates a 3x3 grid with all empty cells', () => {
      const grid = createRectangularGrid({ width: 3, height: 3 });
      expect(grid.size).toBe(9);
      for (let r = 0; r < 3; r++) {
        for (let q = 0; q < 3; q++) {
          expectCellState(grid, q, r, 'empty');
        }
      }
    });

    it('marks blocked cells correctly', () => {
      const blocked: HexCoord[] = [{ q: 1, r: 1 }, { q: 0, r: 2 }];
      const grid = createRectangularGrid({ width: 3, height: 3, blockedCells: blocked });
      expectCellState(grid, 1, 1, 'blocked');
      expectCellState(grid, 0, 2, 'blocked');
      expectCellState(grid, 0, 0, 'empty');
    });

    it('places initial aspects', () => {
      const grid = createRectangularGrid({
        width: 2,
        height: 2,
        initialAspects: [{ coord: { q: 0, r: 0 }, aspect: 'ignis' as any }],
      });
      const cell = getCell(grid, { q: 0, r: 0 });
      expect(cell?.state).toBe('occupied');
      expect(cell?.aspect).toBe('ignis');
    });

    it('cells have correct neighbours (corner cell)', () => {
      const grid = createRectangularGrid({ width: 3, height: 3 });
      const cell = getCell(grid, { q: 0, r: 0 })!;
      // Corners have 2 neighbours in axial rectangular grid (right and down-right)
      expect(cell.connections.length).toBe(2);
      expect(cell.connections).toContainEqual({ q: 1, r: 0 });
      expect(cell.connections).toContainEqual({ q: 0, r: 1 });
    });

    it('cells have correct neighbours (center cell)', () => {
      const grid = createRectangularGrid({ width: 3, height: 3 });
      const cell = getCell(grid, { q: 1, r: 1 })!;
      // Center has 6 neighbours in infinite axial, but since width=3,height=3, all 6 exist? Actually for a compact rectangular shape, some neighbours are outside.
      // Let's calculate: directions: (1,0), (0,1), (-1,1), (-1,0), (0,-1), (1,-1). For q=1,r=1 valid: 2,1 (exists); 1,2 (exists); 0,2 (exists); 0,1 (exists); 1,0 (exists); 2,0 (exists) – all within [0,2]×[0,2]. So 6 neighbours.
      expect(cell.connections.length).toBe(6);
    });
  });

  describe('createGridFromAscii', () => {
    it('creates grid from ascii map', () => {
      const ascii = [
        '.#.',
        '...',
        '#.#',
      ];
      const grid = createGridFromAscii(ascii);
      expect(grid.size).toBe(9);
      expectCellState(grid, 0, 0, 'empty');
      expectCellState(grid, 1, 0, 'blocked');
      expectCellState(grid, 2, 0, 'empty');
      expectCellState(grid, 0, 1, 'empty');
      expectCellState(grid, 1, 1, 'empty');
      expectCellState(grid, 2, 1, 'empty');
      expectCellState(grid, 0, 2, 'blocked');
      expectCellState(grid, 1, 2, 'empty');
      expectCellState(grid, 2, 2, 'blocked');
    });

    it('handles aspect characters when mapping provided', () => {
      const ascii = [
        'A.',
        '..',
      ];
      const charMap: Record<string, any> = { A: 'ignis' };
      const grid = createGridFromAscii(ascii, charMap);
      const cell = getCell(grid, { q: 0, r: 0 });
      expect(cell?.state).toBe('occupied');
      expect(cell?.aspect).toBe('ignis');
    });
  });

  describe('validateGrid', () => {
    it('returns valid for a correct grid', () => {
      const grid = createRectangularGrid({ width: 2, height: 2 });
      const result = validateGrid(grid);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('reports error for occupied cell without aspect', () => {
      // Manually set an occupied cell with no aspect
      const grid = createRectangularGrid({ width: 2, height: 2 });
      const badCell = getCell(grid, { q: 0, r: 0 });
      if (badCell) {
        badCell.state = 'occupied';
        badCell.aspect = undefined;
      }
      const result = validateGrid(grid);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('setCellState', () => {
    it('updates cell state and returns new grid', () => {
      const grid = createRectangularGrid({ width: 2, height: 2 });
      const newGrid = setCellState(grid, { q: 0, r: 0 }, 'occupied', 'ignis' as any);
      const cell = getCell(newGrid, { q: 0, r: 0 });
      expect(cell?.state).toBe('occupied');
      expect(cell?.aspect).toBe('ignis');
      // Original grid unchanged
      expect(getCell(grid, { q: 0, r: 0 })?.state).toBe('empty');
    });
  });
});
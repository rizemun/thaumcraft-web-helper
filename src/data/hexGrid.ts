// Hexagonal grid system for Thaumcraft research field
// Using axial coordinates (q, r) – see https://www.redblobgames.com/grids/hexagons/

import { TAspect } from './types';
import {getEnum, TEnumValue} from "../helpers/enum";

// ------ Types ------

export interface HexCoord {
  q: number;
  r: number;
}

const cellStateVariants = ['empty', 'occupied', 'blocked'] as const;


export const ECellState = getEnum(cellStateVariants);
export type TCellState = TEnumValue<typeof ECellState>

export interface HexCell {
  coord: HexCoord;
  state: TCellState;
  aspect?: TAspect; // only when state === 'occupied'
  connections: HexCoord[]; // list of neighbour coordinates
}

// Grid as a map with key "q,r" for O(1) lookup
export type HexGrid = Map<string, HexCell>;

// ------ Constants ------

// Axial direction vectors for the 6 neighbours
const HEX_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
];

// ------ Helpers ------

export function coordKey(q: number, r: number): string {
  return `${q},${r}`;
}

export function keyToCoord(key: string): HexCoord {
  const [q, r] = key.split(',').map(Number);
  return { q, r };
}

/** Return array of 6 neighbour coordinates (with wrapping? no – flat world) */
export function getNeighbors(coord: HexCoord): HexCoord[] {
  return HEX_DIRECTIONS.map(d => ({
    q: coord.q + d.q,
    r: coord.r + d.r,
  }));
}

// ------ Grid creation ------

export interface RectangularGridConfig {
  width: number;   // number of columns (q)
  height: number;  // number of rows (r)
  blockedCells?: HexCoord[];         // cells that are blocked (empty but can't hold aspect)
  initialAspects?: { coord: HexCoord; aspect: TAspect }[];  // pre-filled cells
}

/** Create a rectangular axial grid starting from the top-left corner (q=0, r=0).
 *  The grid covers a rough rectangular shape with alternating row lengths
 *  to account for offset coordinates (pointy-top orientation). */
export function createRectangularGrid(config: RectangularGridConfig): HexGrid {
  const { width, height, blockedCells = [], initialAspects = [] } = config;

  const blockedSet = new Set<string>(
    blockedCells.map(c => coordKey(c.q, c.r))
  );
  const aspectMap = new Map<string, TAspect>(
    initialAspects.map(item => [coordKey(item.coord.q, item.coord.r), item.aspect])
  );

  const grid: HexGrid = new Map();

  for (let r = 0; r < width; r++) {
    for (let q = 0; q < height; q++) {
      const coord: HexCoord = { q: q - Math.floor(r/2), r };
      const key = coordKey(q - Math.floor(r/2), r);

      let state: TCellState;
      if (blockedSet.has(key)) {
        state = ECellState.blocked;
      } else if (aspectMap.has(key)) {
        state = ECellState.occupied;
      } else {
        state = ECellState.empty;
      }

      const cell: HexCell = {
        coord,
        state,
        aspect: state === ECellState.occupied ? aspectMap.get(key) : undefined,
        connections: [], // filled in post-processing
      };
      grid.set(key, cell);
    }
  }

  // Post-process: compute connections by checking existing neighbours
  grid.forEach(cell => {
    const allNeighbours = getNeighbors(cell.coord);
    const connections: HexCoord[] = [];
    for (const n of allNeighbours) {
      const nKey = coordKey(n.q, n.r);
      if (grid.has(nKey)) {
        connections.push(n);
      }
    }
    cell.connections = connections;
  });

  return grid;
}

/** Create a hexagonal axial grid centered at (0,0) with the given radius.
 *  Radius 1 → 7 cells (centre + 6 neighbours).
 *  Radius 2 → 19 cells, etc.
 *  Uses axial coordinates where |q| <= radius, |r| <= radius, |q + r| <= radius. */
export function createCircularGrid(
  radius: number,
  options?: {
    blockedCells?: HexCoord[];
    initialAspects?: { coord: HexCoord; aspect: TAspect }[];
  }
): HexGrid {
  const { blockedCells = [], initialAspects = [] } = options ?? {};

  const blockedSet = new Set<string>(blockedCells.map(c => coordKey(c.q, c.r)));
  const aspectMap = new Map<string, TAspect>(
    initialAspects.map(item => [coordKey(item.coord.q, item.coord.r), item.aspect])
  );

  const grid: HexGrid = new Map();

  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      const key = coordKey(q, r);
      const coord: HexCoord = { q, r };

      let state: TCellState;
      if (blockedSet.has(key)) {
        state = ECellState.blocked;
      } else if (aspectMap.has(key)) {
        state = ECellState.occupied;
      } else {
        state = ECellState.empty;
      }

      const cell: HexCell = {
        coord,
        state,
        aspect: state === ECellState.occupied ? aspectMap.get(key) : undefined,
        connections: [],
      };
      grid.set(key, cell);
    }
  }

  // Post-process: compute connections by checking existing neighbours
  grid.forEach(cell => {
    const allNeighbours = getNeighbors(cell.coord);
    const connections: HexCoord[] = [];
    for (const n of allNeighbours) {
      const nKey = coordKey(n.q, n.r);
      if (grid.has(nKey)) {
        connections.push(n);
      }
    }
    cell.connections = connections;
  });

  return grid;
}

/** Create a grid from an array of strings (ASCII map).
 *  Each character defines the cell:
 *   '#' -> blocked
 *   '.' -> empty
 *   any letter (a-Z) -> occupied with that aspect name (must match a real aspect)
 *  Spaces are ignored.
 *  The grid is built row by row; q increases horizontally, r vertically.
 *  IMPORTANT: this uses offset coordinate mapping (odd-r offset) for visual convenience;
 *  internally stored as axial (q,r). Offset to axial: q = col - (row - (row&1)) / 2, r = row.
 *  We'll do simple axial (q = col, r = row) for now – the actual visual mapping can be done later in the rendering component.
 */
export function createGridFromAscii(
  rows: string[],
  aspectMap?: Record<string, TAspect>
): HexGrid {
  const grid: HexGrid = new Map();
  const aspectNames = new Set(Object.values({} as Record<string, TAspect>)); // placeholder

  for (let r = 0; r < rows.length; r++) {
    const line = rows[r];
    for (let q = 0; q < line.length; q++) {
      const ch = line[q];
      if (ch === ' ') continue;

      const coord: HexCoord = { q, r };
      const key = coordKey(q, r);

      let state: TCellState;
      let aspect: TAspect | undefined;

      if (ch === '#') {
        state = ECellState.blocked;
      } else if (ch === '.') {
        state = ECellState.empty;
      } else {
        // Treat as aspect identifier – you can pass a mapping from char to aspect name
        state = ECellState.occupied;
        aspect = (aspectMap && aspectMap[ch]) || (ch as TAspect);
      }

      // Compute neighbours (all existing cells will be filled later, but connections can be computed after grid is built)
      // For simplicity, we'll compute neighbours after the grid is fully built
      const cell: HexCell = {
        coord,
        state,
        aspect,
        connections: [], // will be filled in post-processing
      };
      grid.set(key, cell);
    }
  }

  // Now fill connections for each cell
  grid.forEach(cell => {
    const allNeighbours = getNeighbors(cell.coord);
    const connections: HexCoord[] = [];
    for (const n of allNeighbours) {
      const nKey = coordKey(n.q, n.r);
      if (grid.has(nKey)) {
        connections.push(n);
      }
    }
    cell.connections = connections;
  })

  return grid;
}

// ------ Grid manipulation ------

export function setCellState(
  grid: HexGrid,
  coord: HexCoord,
  state: TCellState,
  aspect?: TAspect
): HexGrid {
  const key = coordKey(coord.q, coord.r);
  const cell = grid.get(key);
  if (!cell) throw new Error(`Cell ${key} not found in grid`);

  const newCell: HexCell = {
    ...cell,
    state,
    aspect: state === 'occupied' ? aspect : undefined,
  };

  const newGrid = new Map(grid);
  newGrid.set(key, newCell);
  return newGrid;
}

export function getCell(grid: HexGrid, coord: HexCoord): HexCell | undefined {
  return grid.get(coordKey(coord.q, coord.r));
}

// ------ Validation ------

export interface GridValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGrid(grid: HexGrid): GridValidationResult {
  const errors: string[] = [];

  grid.forEach((cell, key) => {
    // Check that all neighbours in connections exist in the grid
    for (const neighbourCoord of cell.connections) {
      const nKey = coordKey(neighbourCoord.q, neighbourCoord.r);
      if (!grid.has(nKey)) {
        errors.push(`Cell ${key} has neighbour ${nKey} which does not exist in grid.`);
      }
    }

    // Check that if cell is occupied, it has an aspect
    if (cell.state === 'occupied' && !cell.aspect) {
      errors.push(`Cell ${key} is occupied but no aspect assigned.`);
    }

    // Check that if cell is not occupied, aspect is undefined
    if (cell.state !== 'occupied' && cell.aspect !== undefined) {
      errors.push(`Cell ${key} has state '${cell.state}' but has an aspect defined.`);
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ------ Serialization / export ------

/** Convert grid to a plain object (for JSON storage) */
export function serializeGrid(grid: HexGrid): object {
  const cells: object[] = [];
  grid.forEach(cell => {
    cells.push({
      coord: cell.coord,
      state: cell.state,
      aspect: cell.aspect,
      connections: cell.connections,
    });
  })

  return { cells };
}

/** Reconstruct grid from serialized object */
export function deserializeGrid(data: { cells: HexCell[] }): HexGrid {
  const grid: HexGrid = new Map();
  for (const cell of data.cells) {
    const key = coordKey(cell.coord.q, cell.coord.r);
    grid.set(key, {
      coord: cell.coord,
      state: cell.state,
      aspect: cell.aspect,
      connections: cell.connections,
    });
  }
  return grid;
}

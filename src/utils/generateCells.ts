import { MAX_ROWS, MAX_COLS } from '../constants/constants';
import { Cell, CellState, CellValue } from './../types/types';

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = [];

    for (let raw = 0; raw < MAX_ROWS; raw++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[raw].push({
                value: CellValue.none,
                state: CellState.open
            })
        }
    }
    return cells;
}
import { MAX_ROWS, MAX_COLS, NUM_OF_BOMBS } from '../constants/constants';
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

    let bombsPlaced = 0;

    while (bombsPlaced < NUM_OF_BOMBS) {
        const rowBomb = Math.floor(Math.random() * MAX_ROWS);
        const colBomb = Math.floor(Math.random() * MAX_COLS);
        const currentCell = cells[rowBomb][colBomb];

        if (currentCell.value !== CellValue.bomb) {
            cells = cells.map((row, rowInd) => row.map((col, colInd) => {
                if (rowBomb === rowInd && colBomb === colInd) {
                    return {
                        ...col,
                        value: CellValue.bomb
                    }
                }
                return col;
            }))
        }
        bombsPlaced++;
    }

    for (let rowInd = 0; rowInd < MAX_ROWS; rowInd++) {
        for (let colInd = 0; colInd < MAX_COLS; colInd++) {
            const currentCell = cells[rowInd][colInd];
            if (currentCell.value === CellValue.bomb) {
                continue;
            }
            let numberOfBombs = 0;
            const topLeftBomb = rowInd > 0 && colInd > 0 ? cells[rowInd - 1][colInd - 1] : null;
            const topBomb = rowInd > 0 ? cells[rowInd - 1][colInd] : null;
            const topRightBomb = rowInd > 0 && colInd < MAX_COLS - 1 ? cells[rowInd - 1][colInd + 1] : null;
            const rightBomb = colInd < MAX_COLS - 1 ? cells[rowInd][colInd + 1] : null;
            const rightBottomBomb = rowInd < MAX_ROWS - 1 && colInd < MAX_COLS - 1 ? cells[rowInd + 1][colInd + 1] : null;
            const bottomBomb = rowInd < MAX_ROWS - 1 ? cells[rowInd + 1][colInd] : null;
            const leftBottomBomb = rowInd < MAX_ROWS - 1 && colInd > 0 ? cells[rowInd + 1][colInd - 1] : null;
            const leftBomb = colInd > 0 ? cells[rowInd][colInd - 1] : null;

            if (topLeftBomb?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topBomb?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topRightBomb?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (rightBomb?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (rightBottomBomb?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomBomb?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (leftBottomBomb?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (leftBomb?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (numberOfBombs > 0) {
                cells[rowInd][colInd] = {
                    ...currentCell,
                    value: numberOfBombs
                }
            }

        }
    }

    return cells;
}
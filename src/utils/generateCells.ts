import { MAX_ROWS, MAX_COLS, NUM_OF_BOMBS } from '../constants/constants';
import { Cell, CellState, CellValue } from './../types/types';

const checkAdjacentCells = (cells: Cell[][], rowInd: number, colInd: number): {
    topLeftCell: Cell | null;
    topCell: Cell | null;
    topRightCell: Cell | null;
    leftCell: Cell | null;
    rightCell: Cell | null;
    bottomLeftCell: Cell | null;
    bottomCell: Cell | null;
    bottomRightCell: Cell | null;
} => {

    const topLeftCell = rowInd > 0 && colInd > 0 ? cells[rowInd - 1][colInd - 1] : null;
    const topCell = rowInd > 0 ? cells[rowInd - 1][colInd] : null;
    const topRightCell = rowInd > 0 && colInd < MAX_COLS - 1 ? cells[rowInd - 1][colInd + 1] : null;
    const rightCell = colInd < MAX_COLS - 1 ? cells[rowInd][colInd + 1] : null;
    const bottomRightCell = rowInd < MAX_ROWS - 1 && colInd < MAX_COLS - 1 ? cells[rowInd + 1][colInd + 1] : null;
    const bottomCell = rowInd < MAX_ROWS - 1 ? cells[rowInd + 1][colInd] : null;
    const bottomLeftCell = rowInd < MAX_ROWS - 1 && colInd > 0 ? cells[rowInd + 1][colInd - 1] : null;
    const leftCell = colInd > 0 ? cells[rowInd][colInd - 1] : null;
    return {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    }
}

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
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);
    
        const currentCell = cells[randomRow][randomCol];
        if (currentCell.value !== CellValue.bomb) {
          cells = cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (randomRow === rowIndex && randomCol === colIndex) {
                return {
                  ...cell,
                  value: CellValue.bomb
                };
              }
    
              return cell;
            })
          );
          bombsPlaced++;
        }
      }
    

    for (let rowInd = 0; rowInd < MAX_ROWS; rowInd++) {
        for (let colInd = 0; colInd < MAX_COLS; colInd++) {
            const currentCell = cells[rowInd][colInd];
            if (currentCell.value === CellValue.bomb) {
                continue;
            }
            let numberOfBombs = 0;

            const {
                topLeftCell,
                topCell,
                topRightCell,
                leftCell,
                rightCell,
                bottomLeftCell,
                bottomCell,
                bottomRightCell
            } = checkAdjacentCells(cells, rowInd, colInd);
            if (topLeftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (topRightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (rightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomRightCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (bottomLeftCell?.value === CellValue.bomb) {
                numberOfBombs++;
            }
            if (leftCell?.value === CellValue.bomb) {
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

export const openAdjacentNoneCells = (cells: Cell[][], rowInd: number, colInd: number): Cell[][] => {
    const curCell = cells[rowInd][colInd];

    if (curCell.state === CellState.visible || curCell.state === CellState.flagged) return cells;

    let newCells = cells.slice();
    newCells[rowInd][colInd].state = CellState.visible;

    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    } = checkAdjacentCells(cells, rowInd, colInd);

    if (topLeftCell?.state === CellState.open && topLeftCell.value !== CellValue.bomb) {
        if (topLeftCell.value === CellValue.none) {
            newCells = openAdjacentNoneCells(newCells, rowInd - 1, colInd - 1)
        } else {
            newCells[rowInd - 1][colInd - 1].state = CellState.visible;
        }
    }

    if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
        if (topCell.value === CellValue.none) {
            newCells = openAdjacentNoneCells(newCells, rowInd - 1, colInd);
        } else {
            newCells[rowInd - 1][colInd].state = CellState.visible;
        }
    }

    if (topRightCell?.state === CellState.open && topRightCell.value !== CellValue.bomb) {
        if (topRightCell.value === CellValue.none) {
            newCells = openAdjacentNoneCells(newCells, rowInd - 1, colInd + 1);
        } else {
            newCells[rowInd - 1][colInd + 1].state = CellState.visible;
        }
    }

    if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
        if (leftCell.value === CellValue.none) {
            newCells = openAdjacentNoneCells(newCells, rowInd, colInd - 1);
        } else {
            newCells[rowInd][colInd - 1].state = CellState.visible;
        }
    }

    if (rightCell?.state === CellState.open && rightCell.value !== CellValue.bomb) {
        if (rightCell.value === CellValue.none) {
            newCells = openAdjacentNoneCells(newCells, rowInd, colInd + 1);
        } else {
            newCells[rowInd][colInd + 1].state = CellState.visible;
        }
    }

    if (bottomLeftCell?.state === CellState.open && bottomLeftCell.value !== CellValue.bomb) {
        if (bottomLeftCell.value === CellValue.none) {
            newCells = openAdjacentNoneCells(newCells, rowInd + 1, colInd - 1);
        } else {
            newCells[rowInd + 1][colInd - 1].state = CellState.visible;
        }
    }

    if (bottomCell?.state === CellState.open && bottomCell.value !== CellValue.bomb) {
        if (bottomCell.value === CellValue.none) {
            newCells = openAdjacentNoneCells(newCells, rowInd + 1, colInd);
        } else {
            newCells[rowInd + 1][colInd].state = CellState.visible;
        }
    }

    if (bottomRightCell?.state === CellState.open && bottomRightCell.value !== CellValue.bomb) {
        if (bottomRightCell.value === CellValue.none) {
            newCells = openAdjacentNoneCells(newCells, rowInd + 1, colInd + 1);
        } else {
            newCells[rowInd + 1][colInd + 1].state = CellState.visible;
        }
    }

    return newCells;
}
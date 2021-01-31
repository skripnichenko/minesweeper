import React, { useEffect, useState } from 'react';
import './App.scss';
import Button from './components/Button/Button';
import NumberDisplay from './components/NumberDisplay/NumberDisplay';
import { generateCells, openAdjacentNoneCells } from './utils/generateCells';
import { Cell, CellState, CellValue, Face } from './types/types';
import { MAX_COLS, MAX_ROWS } from './constants/constants';

function App() {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<string>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [numberOfBombs, setNumberOfBombs] = useState<number>(10);
  const [lost, setLost] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  useEffect(() => {
    if (!lost && !won) {
      const handleDown = (): void => {
      setFace(Face.oh);
    }
    const handleUp = (): void => {
      setFace(Face.smile);
    }
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    }
    }
    
  });

  useEffect(() => {
    if (isStarted && time < 999) {
      const timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      }
    }
  }, [isStarted, time]);


  useEffect(() => {
    if (lost) {
      setIsStarted(false);
      setFace(Face.lost);
    }
  }, [lost]);

  useEffect(() => {
    if (won) {
      setIsStarted(false);
      setFace(Face.won);
    }
  }, [won]);

  const handleCellClick = (row: number, col: number) => (): void => {

    if (lost) return;

    let currentCells = cells.slice();
    let curCell = cells[row][col];

    if ([CellState.flagged, CellState.visible].includes(curCell.state)) {
      return;
    };

    if (curCell.value === CellValue.bomb) {
      setLost(true);
      currentCells[row][col].red = true;
      currentCells = showAllBombs();
      setCells(currentCells);
      setTime(time);
      return;
    } else if (curCell.value === CellValue.none) {
      openAdjacentNoneCells(currentCells, row, col);
    } else {
      currentCells[row][col].state = CellState.visible;
    }



    let safeOpenCells = false;

    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const curCell = currentCells[row][col];

        if (curCell.state === CellState.open) {
          safeOpenCells = true;
          break;
        }
      }
    }

    if (!isStarted) {
      let isABomb = currentCells[row][col].value === CellValue.bomb;
      while (isABomb) {
        currentCells = generateCells();
        if (currentCells[row][col].value !== CellValue.bomb) {
          isABomb = false;
          break;
        }
      }
      setIsStarted(true);
    }

    if (!safeOpenCells) {
      currentCells = currentCells.map(row =>
        row.map(col => {
          if (col.value === CellValue.bomb) {
            return {
              ...col,
              state: CellState.flagged
            };
          }
          return col;
        })
      );
      setWon(true);
    }
  }


  const onClickContextMenu = (row: number, col: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    if (!isStarted) {
      return;
    }
    
    const currentCells = cells.slice();
    const curCell = cells[row][col];

    if (curCell.state === CellState.visible) {
      return;
    } else if (curCell.state === CellState.open) {
      currentCells[row][col].state = CellState.flagged;
      setCells(currentCells);
      setNumberOfBombs(prev => prev - 1);
    } else if (curCell.state === CellState.flagged) {
      currentCells[row][col].state = CellState.open;
      setCells(currentCells);
      setNumberOfBombs(prev => prev + 1);
    }
  }

  const onFaceClick = (): void => {
    setFace(Face.smile);
    setLost(false);
    setWon(false);
    setIsStarted(false);
    setTime(0);
    setCells(generateCells());
  }


  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) => row.map((col) => {
      if (col.value === CellValue.bomb) {
        return {
          ...col,
          state: CellState.visible
        }
      }
      return col;
    }))
  }

  const renderCells = (): React.ReactNode => {
    return cells.map((row, i_row) => row.map((col, i_col) => <Button key={`${i_row}_${i_col}`} value={col.value}
      state={col.state} row={i_row} col={i_col} onCellClick={handleCellClick}
      onClickContextMenu={onClickContextMenu} isRed={col.red} />))
  }

  return (<div className='App'>
    <div className="header">
      <NumberDisplay value={numberOfBombs} />
      <div className="face" onClick={onFaceClick}>
        <span role='img' aria-label='face'>
          {face}
        </span>
      </div>
      <NumberDisplay value={time} />
    </div>

    <div className="body">
      {renderCells()}
    </div>
  </div>
  )
}

export default App;

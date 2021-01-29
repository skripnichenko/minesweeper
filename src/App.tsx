import React, { useState } from 'react';
import './App.scss';
import Button from './components/Button/Button';
import NumberDisplay from './components/NumberDisplay/NumberDisplay';
import { generateCells } from './utils/generateCells';

function App() {
  const [cells, setCells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, i_row) => row.map((col, i_col) => <Button key={`${i_row}_${i_col}`} value={col.value} state={col.state} row={i_row} col={i_col} />))
  }

  return (<div className='App'>
    <div className="header">
      <NumberDisplay value={0} />
      <div className="face">
        <span role='img' aria-label='face'>
          🙂
        </span>
      </div>
      <NumberDisplay value={23} />
    </div>

    <div className="body">
      {renderCells()}
  </div>
  </div>
  )
}

export default App;

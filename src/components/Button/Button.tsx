import React from 'react';
import { CellState, CellValue } from '../../types/types';
import './Button.scss';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
    onCellClick(row: number, col: number): (...args: any[]) => void;
    onClickContextMenu(row: number, col: number): (...args: any[]) => void;
    isRed?: boolean;
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value, onCellClick, onClickContextMenu, isRed }) => {
    const renderContent = (): React.ReactNode => {
        if (state === CellState.visible) {
            if (value === CellValue.bomb) {
                return <span role='img' aria-label='bomb'>
                    💣
                </span>
            } else if (value === CellValue.none) {
                return null;
            }
            return value;

        } else if (state === CellState.flagged) {
            return <span role='img' aria-label='bomb'>
                🚩
        </span>
        }
    }
    return (
        <div className={`button ${state === CellState.visible ? 'visible' : ''} value-${value} ${isRed ? 'red' : ''}`} onClick={onCellClick(row, col)}  onContextMenu={onClickContextMenu(row, col)}>
            {renderContent()}
        </div>
    )
}

export default Button;
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { Coordinate, TileEntity } from '../Tile/TileEntity';
import styles from "./Pyramid.module.css"
import { Tile } from '../Tile/Tile';
import { Board } from './Board';
import { BoardEntity } from './BoardEntity';

type PyramidProps = {
  increasePoints: () => void;
  decreasePoints: () => void;
  nextRound(): void;
  targetNumber: number;
  board: BoardEntity;
  possibleMoves: number;
}

/**
 * The Pyramid board that will be used to display and play tthe game.
 * It consists of a grid of tiles that will be used to play the game.
 * The tiles will be used to perform operations and get the result.
 */
export const Pyramid: React.FC<PyramidProps> = ({
  targetNumber,
  board,
  increasePoints,
  decreasePoints,
  nextRound,
  possibleMoves,
}) => {
  return  <div className={styles.pyramidContainer}>
      <h1>Pyramid Equations</h1>
      <div className={styles.guesses}>Correct Guesses: {board?.history.length ?? 0}</div>
      <div className={styles.pyramid}>
        <Board
          board={board}
          targetNumber={targetNumber}
          increasePoints={increasePoints}
          decreasePoints={decreasePoints}
          nextRound={nextRound}
          possibleMoves={possibleMoves}
        />
      </div>
  </div>
}
import { useEffect, useState } from "react";
import { Pyramid } from "./Pyramid/Pyramid"
import { Stopwatch } from "./Stopwatch/Stopwatch"

import styles from "./Game.module.css"
import { BoardEntity } from "./Pyramid/BoardEntity";
import { getDefaultRandomInt } from "./utils/Utils";

export const Game = () => {
  // Generate a random number between 1 and 10
  const [targetNumber, setTargetNumber] = useState(getDefaultRandomInt());
  const [points, setPoints] = useState(0);
  const [board, setBoard] = useState<BoardEntity | undefined>();
  const [possibleMoves, setPossibleMoves] = useState<number>(0);
  const [rounds, setRounds] = useState(1);

  useEffect(() => {
    if (board === undefined) {
      return;
    }
    const possibleMoves = board.numPossibleMoves;
    if (possibleMoves < 2) {
      setBoard(new BoardEntity(targetNumber));
      return;
    }
    setPossibleMoves(possibleMoves);
  }, [board, targetNumber])

  useEffect(() => {
    const nextTargetNumber = getDefaultRandomInt();
    const newBoard = new BoardEntity(nextTargetNumber);
    setBoard(newBoard);
    setTargetNumber(nextTargetNumber);
  }, [rounds]);

  if (board === undefined) {
    return null;
  }

  const increasePoints = () => {
    setPoints((prevPoints) => prevPoints + 1);
  }
  const decreasePoints = () => {
    setPoints((prevPoints) => prevPoints - 1);
  }

  const nextRound = () => {
    setRounds((prevRounds) => prevRounds + 1);
  }

  return (
    <>
      {
        <Pyramid
          increasePoints={increasePoints}
          decreasePoints={decreasePoints}
          targetNumber={targetNumber}
          nextRound={nextRound}
          board={board}
          possibleMoves={possibleMoves}
        />
      }
      <div className={styles.infoContainer}>
        <div>Round #{rounds}</div>
        {
          possibleMoves > 0 && (
            <div className={styles.info}>Possible Moves: {possibleMoves}</div>
          )
        }
        <div className={styles.info}>Target Number: {targetNumber}</div>
        <div className={styles.info}>Points: {points}</div>
        <Stopwatch />
      </div>
      <div className={styles.historyCnotainer}>
        <div className={styles.historyTitle}>History</div>
        <div className={styles.history}>
          {
            board.history.map((tiles) => {
              const tilesString = tiles.map(tile => `(${tile.tileOperationDisplay}, ${tile.value})`).join(" ");
              return (
                <div key={tilesString} className={styles.historyRow}>
                  {tilesString}
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}
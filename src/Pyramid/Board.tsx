import { useCallback, useEffect, useState } from "react";
import type { TileEntity } from "../Tile/TileEntity";
import type { BoardEntity } from "./BoardEntity";
import { Tile } from "../Tile/Tile";
import styles from "./Board.module.css"

type BoardProps = {
  board: BoardEntity;
  targetNumber: number;
  increasePoints: () => void;
  decreasePoints: () => void;
  nextRound: () => void;
  possibleMoves: number;
}

export const Board: React.FC<BoardProps> = ({
  board,
  targetNumber,
  increasePoints,
  decreasePoints,
  nextRound,
  possibleMoves,
}) => {
  const [selectedTiles, setSelectedTiles] = useState<TileEntity[]>([]);

  const handleTileClick = (tile: TileEntity) => {
    if (selectedTiles.length < 3) {
      setSelectedTiles((prevSelectedTiles) => [...prevSelectedTiles, tile]);
    }
  }

  useEffect(() => {
    const isValidMove = () => {
      const firstTile = selectedTiles[0];
      const result1 = firstTile.applyTile(selectedTiles[1]).applyTile(selectedTiles[2]);
      const result2 = firstTile.applyTile(selectedTiles[2]).applyTile(selectedTiles[1]);
      return result1.value === targetNumber || result2.value === targetNumber;
    }
    if (selectedTiles.length === 3) {
      if (isValidMove()) {
        if (board.isInHistory(selectedTiles)) {
          alert("You have already used this combination of tiles.");
          decreasePoints();
          setSelectedTiles([]);
          return;
        }
        board.addToHistory(selectedTiles);
        increasePoints();

        if (board.history.length === possibleMoves) {
          alert("You have used all the possible moves.");
          nextRound();
          setSelectedTiles([]);
        }
      } else {
        decreasePoints();
      }

      setSelectedTiles([]);
    }
  }, [selectedTiles])

  const tiles = board.tiles;
  const renderTileBoard = useCallback(() => {
    const rows = Object.keys(tiles);
    return rows.map((row, index) => {
      const tileRow = tiles[Number(row)];
      return (
        <div key={index} className={styles.tileRow}>
          {tileRow.map((tile, tileIndex) => {
            const isSelected = selectedTiles.some((selectedTile) => selectedTile.equals(tile));
            return (
              <Tile
                key={tileIndex}
                tileEntity={tile}
                onClick={() => handleTileClick(tile)}
                isSelected={isSelected}
              />
            )
          })}
        </div>
      );
    });
  }, [board, selectedTiles]);

  return <div className={styles.boardContainer}>
    {renderTileBoard()}
  </div>
}


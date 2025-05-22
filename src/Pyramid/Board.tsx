import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { BoardEntity } from "./BoardEntity";
import { Tile, type TileHandle } from "../Tile/Tile";
import styles from "./Board.module.css"
import { Alert } from "../Alert/Alert";

type BoardProps = {
  board: BoardEntity;
  targetNumber: number;
  increasePoints: () => void;
  decreasePoints: () => void;
  nextRound: () => void;
  possibleMoves: number;
}


type AlertMessage = {
  title?: string;
  message?: string;
  variant?: "info" | "success" | "warning" | "error";
}

const isTileRefNotNull = (ref: RefObject<TileHandle | null>): ref is RefObject<TileHandle> => {
  if (ref.current !== null) {
    return true;
  }
  return false;
}

export const Board: React.FC<BoardProps> = ({
  board,
  targetNumber,
  increasePoints,
  decreasePoints,
  nextRound,
  possibleMoves,
}) => {
  const [selectedTiles, setSelectedTiles] = useState<RefObject<TileHandle>[]>([]);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | undefined>(undefined);

  const handleTileClick = (tile: RefObject<TileHandle | null>) => {
    if (!isTileRefNotNull(tile)) {
      return;
    }
    if (selectedTiles.findIndex(selectedTile => selectedTile === tile) !== -1) {
      return;
    }
    if (selectedTiles.length < 3) {
      setSelectedTiles((prevSelectedTiles) => [...prevSelectedTiles, tile]);
    }
  }

  useEffect(() => {
    const selectedTileEntities = selectedTiles.
      map((tile) => tile.current.getTileEntity()).
      filter((tile) => !!tile);

    const isValidMove = () => {
      const firstTile = selectedTileEntities[0];
      const result1 = firstTile.applyTile(selectedTileEntities[1]).applyTile(selectedTileEntities[2]);
      const result2 = firstTile.applyTile(selectedTileEntities[2]).applyTile(selectedTileEntities[1]);
      return result1.value === targetNumber || result2.value === targetNumber;
    }
    if (selectedTiles.length === 3) {
      if (isValidMove()) {
        if (board.isInHistory(selectedTileEntities)) {
          setAlertMessage({
            title: "Invalid Move",
            message: "You have already used this combination of tiles.",
            variant: "error"
          });
          decreasePoints();
          setSelectedTiles([]);
          return;
        }
        selectedTiles.forEach(tile => tile.current.triggerTilesValidMove())
        board.addToHistory(selectedTileEntities);
        increasePoints();
        if (board.history.length === possibleMoves) {
          setAlertMessage({
            title: "Round Complete",
            message: "All possible moves were found",
            variant: "success"
          });
          nextRound();
        }
      } else {
        selectedTiles.forEach(tile => tile.current.triggerTilesInvalidMove())
        setAlertMessage({
          title: "Invalid Target",
          message: "The selected tiles do not equal the target number.",
          variant: "error"
        });
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
            const isSelected = selectedTiles.some((selectedTile) => selectedTile.current.getTileEntity()?.equals(tile));
            const ref = useRef<TileHandle | null>(null);
            return (
              <Tile
                ref={ref}
                key={tileIndex}
                tileEntity={tile}
                onClick={() => handleTileClick(ref)}
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
    <Alert
      title={alertMessage?.title}
      message={alertMessage?.message}
      variant={alertMessage?.variant}
      onClose={() => setAlertMessage(undefined)}
    />
  </div>
}


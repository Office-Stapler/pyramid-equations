import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { BoardEntity } from "./BoardEntity";
import { Tile, type TileHandle } from "../Tile/Tile";
import styles from "./Board.module.css";
import { Alert } from "../Alert/Alert";

// --- Types ---
type BoardProps = {
  board: BoardEntity;
  targetNumber: number;
  increasePoints: () => void;
  decreasePoints: () => void;
  nextRound: () => void;
  possibleMoves: number;
};

type AlertMessage = {
  title?: string;
  message?: string;
  variant?: "info" | "success" | "warning" | "error";
};

// --- Board Component ---
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

  // Memoize handleTileClick to prevent unnecessary re-renders of Tile components
  // when it's passed down as a prop.
  const handleTileClick = useCallback((tileRef: RefObject<TileHandle>) => {
    // Ensure the ref has a current value and the tile isn't already selected.
    if (!tileRef.current || selectedTiles.some((selectedTile) => selectedTile === tileRef)) {
      return;
    }

    if (selectedTiles.length < 3) {
      setSelectedTiles((prevSelectedTiles) => [...prevSelectedTiles, tileRef]);
    }
  }, [selectedTiles]); // Dependency on selectedTiles to ensure latest state

  // Effect to handle tile selection logic
  useEffect(() => {
    // Only proceed when 3 tiles are selected
    if (selectedTiles.length !== 3) {
      return;
    }

    const selectedTileEntities = selectedTiles
      .map((tileRef) => tileRef.current?.getTileEntity())
      .filter(tile => !!tile);

    // If for some reason we don't have 3 valid tile entities, reset and alert
    if (selectedTileEntities.length !== 3) {
      setAlertMessage({
        title: "Error",
        message: "Could not process selected tiles. Please try again.",
        variant: "error",
      });
      setSelectedTiles([]);
      return;
    }

    const [firstTile, secondTile, thirdTile] = selectedTileEntities;

    // Helper to check if a move is valid
    const isValidMove = () => {
      const result1 = firstTile.applyTile(secondTile).applyTile(thirdTile);
      const result2 = firstTile.applyTile(thirdTile).applyTile(secondTile);
      return result1.value === targetNumber || result2.value === targetNumber;
    };

    if (isValidMove()) {
      // Check for duplicate move
      if (board.isInHistory(selectedTileEntities)) {
        setAlertMessage({
          title: "Invalid Move",
          message: "You have already used this combination of tiles.",
          variant: "error",
        });
        decreasePoints();
      } else {
        selectedTiles.forEach((tileRef) => tileRef.current?.triggerTilesValidMove());
        board.addToHistory(selectedTileEntities);
        increasePoints();

        if (board.history.length === possibleMoves) {
          setAlertMessage({
            title: "Round Complete",
            message: "All possible moves were found",
            variant: "success",
          });
          // This timeout gives the user a chance to see the "valid" animation
          setTimeout(() => nextRound(), 1000);
        }
      }
    } else {
      selectedTiles.forEach((tileRef) => tileRef.current?.triggerTilesInvalidMove());
      setAlertMessage({
        title: "Invalid Target",
        message: "The selected tiles do not equal the target number.",
        variant: "error",
      });
      decreasePoints();
    }

    // Always reset selected tiles after processing a move
    setSelectedTiles([]);
  }, [selectedTiles, board, targetNumber, increasePoints, decreasePoints, nextRound, possibleMoves]);

  // Memoize tile rendering to prevent re-rendering the entire board
  // unless `board` or `selectedTiles` change.
  const renderTileBoard = useCallback(() => {
    const rows = Object.keys(board.tiles);
    return rows.map((row, index) => {
      const tileRow = board.tiles[Number(row)];
      return (
        <div key={index} className={styles.tileRow}>
          {tileRow.map((tileEntity, tileIndex) => {
            const ref = useRef<TileHandle | null>(null);
            // Check if the current tile's entity is among the selected ones
            const isSelected = selectedTiles.some((selectedTileRef) =>
              selectedTileRef.current?.getTileEntity()?.equals(tileEntity)
            );

            return (
              <Tile
                ref={ref}
                key={tileIndex}
                tileEntity={tileEntity}
                onClick={() => {
                  // Only call handleTileClick if the ref has a current value,
                  // ensuring we pass a valid RefObject<TileHandle>
                  if (ref.current) {
                    handleTileClick(ref as RefObject<TileHandle>);
                  }
                }}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      );
    });
  }, [board, selectedTiles, handleTileClick]); // Add handleTileClick to dependencies

  return (
    <div className={styles.boardContainer}>
      {renderTileBoard()}
      <Alert
        title={alertMessage?.title}
        message={alertMessage?.message}
        variant={alertMessage?.variant}
        onClose={() => setAlertMessage(undefined)}
      />
    </div>
  );
};
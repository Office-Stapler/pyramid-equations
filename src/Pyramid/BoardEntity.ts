import type { TileOperation } from "../Tile/Operations";
import { Coordinate, TileEntity } from "../Tile/TileEntity";

/**
 * A board in the shape of a pyramid, the first row has 1 tile, the second row has 2 tiles,
 * the third row has 3 tiles and the fourth row has 4 tiles.
 */
export class BoardEntity {

  private static HISTORY_TILE_SIZE = 3;

  private generateTiles = () => {
    const tiles: Record<number, TileEntity[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
    }
    const seen: Record<TileOperation, Set<number>> = {
      add: new Set(),
      subtract: new Set(),
      multiply: new Set(),
      divide: new Set(),
    };
    for (const key in tiles) {
      const tileCount = Number.parseInt(key);
      for (let i = 0; i < tileCount; i++) {
        const coordinate = Coordinate.newCoordinate(tileCount, i);
        // Create a new tile and add it to the board
        // Guarantee that a tile is a unique combination of operation and value
        let tile = TileEntity.newRandomTile(coordinate);
        while (seen[tile.tileOperation].has(tile.value)) {
          tile = TileEntity.newRandomTile(coordinate);
        }
        seen[tile.tileOperation].add(tile.value);
        tiles[tileCount].push(tile);
      }
    }
    return tiles;
  }

  private _tiles: Record<number, TileEntity[]>;
  private _targetNumber: number;
  private _history: TileEntity[][] = [];
  private _numPossibleMoves: number = 0;
  private _hasDecimalPossibility: boolean = true;

  constructor(targetNumber: number) {
    this._targetNumber = targetNumber;
    this._tiles = this.generateTiles();
    this._numPossibleMoves = this.calcNumPossibleMoves(targetNumber);
    // Keep generating tiles until there are no decimal possibilities
    // This is to ensure that the game is solvable
    // and that the player can get the target number without getting a decimal number
    while (this._hasDecimalPossibility) {
      console.log("Generatin new board...")
      this._tiles = this.generateTiles();
      this._numPossibleMoves = this.calcNumPossibleMoves(targetNumber);
    }
  }

  get tiles(): Record<number, TileEntity[]> {
    return this._tiles;
  }

  get targetNumber(): number {
    return this._targetNumber;
  }

  get history(): TileEntity[][] {
    return this._history;
  }

  get numPossibleMoves(): number {
    return this._numPossibleMoves;
  }

  addToHistory(tiles: TileEntity[]): void {
    if (tiles.length !== BoardEntity.HISTORY_TILE_SIZE) {
      return;
    }
    this._history.push(tiles);
  }

  isInHistory(tiles: TileEntity[]): boolean {
    return this._history.some((historyTiles) => {
      if (!tiles[0].equals(historyTiles[0])) {
        return false;
      }

      const secondTile = tiles[1];
      const thirdTile = tiles[2];
      const secondTileHistory = historyTiles[1];
      const thirdTileHistory = historyTiles[2];

      const possibility1 = secondTile.equals(secondTileHistory) && thirdTile.equals(thirdTileHistory);
      const possibility2 = secondTile.equals(thirdTileHistory) && thirdTile.equals(secondTileHistory);

      return possibility1 || possibility2;
    })
  }


  private checkHasDecimalCombination(tile1: TileEntity, tile2: TileEntity, tile3: TileEntity): boolean {
    const operations = [
      tile1.applyTile(tile2),
      tile1.applyTile(tile3),
      tile2.applyTile(tile3),
      tile3.applyTile(tile2)
    ];

    for (const result of operations) {
      if (!Number.isInteger(result.value)) {
        this._hasDecimalPossibility = true;
        return true;
      }
    }
    return false;
  }

  private calcNumPossibleMoves(targetNumber: number): number {
    let possibleMoves = 0;
    const tiles: TileEntity[] = [];
    const board = this.tiles;
    for (const key in board) {
      tiles.push(...board[key]);
    }
    let i = 0, j = 0, k = 0;
    // Brute force all possible combinations of tiles
    for (i = 0; i < tiles.length; i++) {
      const tile1 = tiles[i];
      for (j = 0; j < tiles.length; j++) {
        if (j === i) {
          continue;
        }
        const tile2 = tiles[j];
        for (k = j + 1; k < tiles.length; k++) {
          if (k === i) {
            continue;
          }
          const tile3 = tiles[k];
          const result1 = tile1.applyTile(tile2).applyTile(tile3);
          const result2 = tile1.applyTile(tile3).applyTile(tile2);
          if (result1.value === targetNumber || result2.value === targetNumber) {
            // Only divide operations can result in a decimal number
            if (tile2.tileOperation === "divide" || tile3.tileOperation === "divide") {
              if (this.checkHasDecimalCombination(tile1, tile2, tile3)) {
                return 0;
              }
            }
            console.log("Possible move found ", `[${tile1}, ${tile2}, ${tile3}]`)
            possibleMoves++;
          }
        }
      }
    }
    this._hasDecimalPossibility = false;
    return possibleMoves;
  }

}
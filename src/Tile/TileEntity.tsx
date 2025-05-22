import { getDefaultRandomInt, getRandomInt } from "../utils/Utils";
import type { TileOperation } from "./Operations";

export class Coordinate {
    row: number;
    column: number;

    constructor(row: number, column: number) {
        this.column = column;
        this.row = row;
    }

    static newCoordinate(row: number, column: number): Coordinate {
        return new Coordinate(row, column);
    }

    equals(coordinate: Coordinate): boolean {
        return this.column === coordinate.column && this.row === coordinate.row;
    }

};

/**
 * Tile of the equation pyramid, each tile has a value and an operation
 * The operation is the operation that will be performed on a seperte tile.
 * When applying another tile, the first tile will drop the operation and perform
 * the operation of the second tile.
 */
export class TileEntity {
    private _tileOperation: TileOperation;
    private _value: number;
    private _coordinate: Coordinate;
    private static operations: TileOperation[] = ['add', 'subtract', 'multiply', 'divide'];
    private static operationSymbols: Record<TileOperation, string> = {
        add: '+',
        subtract: '-',
        multiply: 'x',
        divide: '÷',
    };

    constructor(value: number, tileOperation: TileOperation, coordinate: Coordinate) {
        this._tileOperation = tileOperation;
        this._value = value;
        this._coordinate = coordinate;
    }

    static newRandomTile(coordinate: Coordinate): TileEntity {
        const value = getDefaultRandomInt();
        const randomOperation = this.operations[getRandomInt(0, this.operations.length - 1)];
        return new TileEntity(value, randomOperation, coordinate);
    }

    private applyOperation(value: number, operation: TileOperation): number {
        // Apply the operation to the value and return the result
        switch (operation) {
            case 'add':
                return this._value + value;
            case 'subtract':
                return this._value - value;
            case 'multiply':
                return this._value * value;
            case 'divide':
                if (value === 0) {
                    throw new Error("Division by zero is not allowed");
                }
                return this._value / value;
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }

    /**
     * Apply a different tile to this current tile and return a new tile
     * with the result of the operation and the tile operation of the second tile
     * @param tile The tile to apply
     * @returns A new tile with the result of the operation
     * and the tile operation of the second tile
     */
    applyTile(tile: TileEntity): TileEntity {
        // The new title operation doesn't matter since we will drop it
        // and use the operation of the second tile
        return new TileEntity(
            this.applyOperation(tile.value, tile.tileOperation),
            tile.tileOperation,
            this._coordinate
        );
    }

    equals(tile: TileEntity): boolean {
        // Check if the tile is equal to this tile
        const sameValue = this._value === tile.value;
        const sameOperation = this._tileOperation === tile.tileOperation;
        const sameCoordinate = this._coordinate.equals(tile._coordinate);
        return sameCoordinate && sameValue && sameOperation;
    }

    get tileOperationDisplay(): string {
        return TileEntity.operationSymbols[this._tileOperation];
    }

    get tileOperation(): TileOperation {
        return this._tileOperation;
    }

    set tileOperation(value: TileOperation) {
        this._tileOperation = value;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }
}
export const TILE_OPERATIONS = {
    ADD: 'add',
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    DIVIDE: 'divide',
} as const;

export type TileOperation = typeof TILE_OPERATIONS[keyof typeof TILE_OPERATIONS];
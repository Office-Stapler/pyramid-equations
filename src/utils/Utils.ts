
/**
 * Randomly generates an integer between the given min and max values.
 * The generated integer is inclusive of both min and max.
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random integer between 1 and 15.
 * @returns A random integer between 1 and 15.
 */
export const getDefaultRandomInt = () => getRandomInt(1, 15);
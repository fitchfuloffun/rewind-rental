// constants/storeDimensions.js
export const STORE_DIMENSIONS = {
  WIDTH: 26,
  DEPTH: 20,
  HEIGHT: 6,
  WALL_THICKNESS: 0.1,

  // Calculated values
  get HALF_WIDTH() {
    return this.WIDTH / 2;
  },
  get HALF_DEPTH() {
    return this.DEPTH / 2;
  },
  get HALF_HEIGHT() {
    return this.HEIGHT / 2;
  },
};

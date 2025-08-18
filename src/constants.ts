// constants/storeDimensions.js
export const STORE_DIMENSIONS = {
  WIDTH: 40,
  DEPTH: 26,
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

export const VIDEO_DIMENSIONS = {
  WIDTH: 0.52,
  HEIGHT: 0.65,
  DEPTH: 0.13,

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

export const SHELF_DIMENSIONS = {
  WIDTH: 3,
  HEIGHT: 3,
  DEPTH: 0.5,

  // Calculated values
  get HALF_WIDTH() {
    return this.WIDTH / 2;
  },
  get HALF_HEIGHT() {
    return this.HEIGHT / 2;
  },

  get VIDEO_SLOTS() {
    const horizontalSlots = Math.floor(
      SHELF_DIMENSIONS.WIDTH / VIDEO_DIMENSIONS.WIDTH,
    );
    const verticalSlots = Math.floor(
      SHELF_DIMENSIONS.HEIGHT / VIDEO_DIMENSIONS.HEIGHT,
    );

    const horizontalSpacing = SHELF_DIMENSIONS.WIDTH / horizontalSlots;
    const verticalSpacing = SHELF_DIMENSIONS.HEIGHT / verticalSlots;

    let slots: [x: number, y: number, z: number][] = [];

    for (let i = verticalSlots; i > 0; i--) {
      for (let j = 0; j < horizontalSlots; j++) {
        slots.push([
          horizontalSpacing * j -
            SHELF_DIMENSIONS.HALF_WIDTH +
            VIDEO_DIMENSIONS.HALF_WIDTH,
          verticalSpacing * i -
            SHELF_DIMENSIONS.HALF_HEIGHT -
            VIDEO_DIMENSIONS.HALF_HEIGHT,
          SHELF_DIMENSIONS.DEPTH - 0.15,
        ]);
      }
    }

    return slots;
  },
};

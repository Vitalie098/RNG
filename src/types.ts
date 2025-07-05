export type Point = {
  x: number;
  y: number;
};

export type Circle = Point & {
  r: number;
};

export type Square = Point & {
  w: number;
};

export type BlockData = Square & {
  val: number;
};

export type BallData = Circle & {
  dx: number;
  dy: number;
};
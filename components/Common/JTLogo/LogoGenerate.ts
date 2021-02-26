const random = (to: number, from = 0): number => {
  return Math.random() * (to - from) + from;
};

const QUARTER_PI = Math.PI * 0.25;
// const HALF_PI = Math.PI * 0.5;
const PI = Math.PI;
const TWO_PI = Math.PI * 2;

const STROKE_WIDTH = 4;

let ctx;

const setDimensions = (canvas, ctx, width, height, pixelRatio) => {
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.scale(pixelRatio, pixelRatio);
};

const topPart = (x, y, width, height, strokeWidth) => {
  ctx.save();

  ctx.translate(x, y + height / 2);
  // ctx.strokeRect(0, 0, width, height);

  const randX = random(20);
  const randY = random(5, 3);

  let inc = Math.ceil(random(10));

  if (inc < 5) {
    inc = 1;
  }

  const choice = Math.ceil(random(3));

  const skew = random(4) + 4;

  if (choice === 3) {
    inc = width / 5;
  }

  for (let _x = 0; _x < width; _x += inc) {
    const _y = Math.sin(_x / (width / randX)) * (height / randY);

    ctx.beginPath();
    switch (choice) {
      case 3:
        ctx.save();
        ctx.translate(_x, -skew);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(inc, skew);
        ctx.lineTo(inc, height * 0.75 + skew);
        ctx.lineTo(0, height * 0.75);
        ctx.closePath();

        ctx.restore();
        ctx.stroke();
        break;
      default:
        ctx.arc(_x, _y, strokeWidth / 2, 0, TWO_PI);
        ctx.fill();
        break;
    }
  }

  ctx.restore();
};

const middlePart = (x, y, width, height) => {
  ctx.save();

  ctx.translate(x, y);
  // ctx.strokeRect(0, 0, width, height);

  const mod = random(0.25);

  const h = (num) => height * num;
  const w = (num) => width * num * 2;

  // if (Math.random() > 0.5) {
  //   mod *= -1;
  // }

  ctx.beginPath();

  ctx.moveTo(w(mod), h(0.25) - h(mod));
  ctx.lineTo(width - w(mod), h(0.25) + h(mod));
  ctx.lineTo(width - w(mod), h(0.75) + h(mod));
  ctx.lineTo(w(mod), h(0.75) - h(mod));

  ctx.closePath();
  ctx.stroke();

  ctx.restore();
};

const bottomPart = (x, y, width, height) => {
  ctx.save();

  ctx.translate(x, y);
  // ctx.strokeRect(0, 0, width, height);

  const circles = 5;

  const total = random(circles) + 1;

  for (let i = circles - 1; i >= 0; i--) {
    if (i < total) {
      const start = PI + PI * random(0.25);
      const end = start + random(QUARTER_PI) + QUARTER_PI * 0.5;

      ctx.beginPath();
      ctx.arc(width, height, (width / circles) * i, start, end);
      ctx.stroke();
    }
  }

  ctx.restore();
};

export const generate = (
  canvas: HTMLCanvasElement,
  _ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strokeWidth = STROKE_WIDTH,
  color = "white"
): void => {
  ctx = _ctx;

  setDimensions(canvas, ctx, width, height, window.devicePixelRatio);

  ctx.clearRect(0, 0, width, height);

  // A variable to increase/decrease padding with ease
  const mod = 1;

  // Create a clipped width and height to clear the surrounding box
  const _width = width - strokeWidth * mod;
  const _height = height - strokeWidth * mod;

  ctx.save();
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Move into the clipped zone
  ctx.translate(strokeWidth * (mod / 2), strokeWidth * (mod / 2));

  // Add the surrounding bounding box
  ctx.strokeRect(0, 0, _width, _height);

  topPart(0, 0, _width, _height * 0.25, strokeWidth);

  middlePart(_width * 0.35, 0, _width * 0.3, _height);

  bottomPart(0, _height * 0.5, _width * 0.5, _height * 0.5);

  ctx.restore();
};

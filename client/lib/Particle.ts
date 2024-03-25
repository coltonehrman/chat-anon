export class Particle {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 15 + 1;
    this.speedX = Math.random() * 0.17 - 0.002;
    this.speedY = Math.random() * 0.17 - 0.002;
  }

  update(mouse: { x: number; y: number }) {
    this.x += this.speedX;
    this.y += this.speedY;
    if (
      mouse.x &&
      mouse.y &&
      Math.abs(mouse.x - this.x) < 50 &&
      Math.abs(mouse.y - this.y) < 50
    ) {
      this.speedX = -this.speedX;
      this.speedY = -this.speedY;
    }
  }

  draw() {
    this.ctx.fillStyle = "rgb(77, 77, 77)";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

import "./style.css";
import { Ball } from "./Ball.ts";
import { randomColor, checkCollision } from "./utils.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const colors = ["#2185C5", "#7ECEFD", "#FF7F66", "#06686f"];
const balls: Ball[] = [];
const maxBalls = 15;

canvas.width = 900;
canvas.height = 600;

function gameLoop() {
  requestAnimationFrame(gameLoop);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  checkCollision(balls);

  for (let i = 0; i < balls.length; i++) {
    balls[i].update(canvas);
  }

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw(ctx);
  }
}

gameLoop();

canvas.onclick = (e) => {
  const ball = new Ball(e.clientX, e.clientY, randomColor(colors));
  if (balls.length <= maxBalls) {
    balls.push(ball);
  }
};

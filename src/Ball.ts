export class Ball {
  x: number;
  y: number;
  velocity: {
    x: number;
    y: number;
  };
  static radius: number = 20;
  color: string;
  static settings = {
    airFactor: 0.995,
    hitFactor: 0.8,
    rollingFactor: 0.98,
    gravity: 0.7,
  };

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  static distance(p1: Point, p2: Point) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  static moveBallsOutOfCollision(ball1: Ball, ball2: Ball) {
    let v = {
      x: ball1.velocity.x - ball2.velocity.x,
      y: ball1.velocity.y - ball2.velocity.y,
    };
    let p = {
      x: ball1.x - ball2.x,
      y: ball1.y - ball2.y,
    };
    let r = Ball.radius + Ball.radius;

    // quadratic coificients
    let a = v.x * v.x + v.y * v.y;
    let b = -2 * (p.x * v.x + p.y * v.y);
    let c = p.x * p.x + p.y * p.y - r * r;

    // discriminant
    let d = b * b - 4 * a * c;

    let t = (-b - Math.sqrt(d)) / (2 * a);
    if (t < 0) t = (-b + Math.sqrt(d)) / (2 * a);

    let oldPosition1 = {
      x: ball1.x - ball1.velocity.x * t,
      y: ball1.y - ball1.velocity.y * t,
    };
    let oldPosition2 = {
      x: ball2.x - ball2.velocity.x * t,
      y: ball2.y - ball2.velocity.y * t,
    };

    let maxChange = Ball.radius * 3;

    if (
      a == 0 ||
      d < 0 ||
      Ball.distance(oldPosition1, ball1) > maxChange ||
      Ball.distance(oldPosition2, ball2) > maxChange
    ) {
      if (Ball.distance(ball1, ball2) === 0) {
        ball1.y = ball1.y + -r;
      } else {
        let diff = (r - Ball.distance(ball1, ball2)) / 2;
        ball1.x = ball1.x + (ball1.x - ball2.x * diff);
        ball1.y = ball1.y + (ball1.y - ball2.y * diff);

        ball2.x = ball2.x + (ball2.x - ball1.x) * diff;
        ball2.y = ball2.y + (ball2.y - ball1.y) * diff;
      }
    } else {
      ball1.x = oldPosition1.x;
      ball1.y = oldPosition1.y;
      ball2.x = oldPosition2.x;
      ball2.y = oldPosition2.y;
    }
  }

  collision(ball: Ball) {
    if (
      Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)) <=
      Ball.radius * 2
    ) {
      Ball.moveBallsOutOfCollision(this, ball);

      let positionSub = {
        x: this.x - ball.x,
        y: this.y - ball.y,
      };
      let distance = Math.sqrt(
        positionSub.x * positionSub.x + positionSub.y * positionSub.y,
      );

      let coeff =
        ((this.velocity.x - ball.velocity.x) * positionSub.x +
          (this.velocity.y - ball.velocity.y) * positionSub.y) /
        (distance * distance);

      this.velocity.x = this.velocity.x - positionSub.x * coeff;
      this.velocity.y = this.velocity.y - positionSub.y * coeff;

      ball.velocity.x = ball.velocity.x - -positionSub.x * coeff;
      ball.velocity.y = ball.velocity.y - -positionSub.y * coeff;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  static isNearZero(p: Point) {
    return Math.sqrt(p.x * p.x + p.y * p.y) < 0.01;
  }

  update(canvas: HTMLCanvasElement): void {
    if (
      Math.sqrt(
        this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y,
      ) < 0.01 &&
      this.y == canvas.height - Ball.radius &&
      !(this.x === 0 && this.y === 0)
    )
      this.velocity = {
        x: 0,
        y: 0,
      };

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x <= Ball.radius || this.x >= canvas.width - Ball.radius) {
      this.x = this.x <= Ball.radius ? Ball.radius : canvas.width - Ball.radius;

      this.velocity.x = -this.velocity.x;
    }
    if (this.y <= Ball.radius || this.y >= canvas.height - Ball.radius) {
      this.y =
        this.y <= Ball.radius ? Ball.radius : canvas.height - Ball.radius;

      if (this.y == canvas.height - Ball.radius) {
        this.velocity.y *= Ball.settings.hitFactor;
        this.velocity.x *= Ball.settings.rollingFactor;
      }

      this.velocity.y = -this.velocity.y;
    }

    this.velocity.x *= Ball.settings.airFactor;
    this.velocity.y *= Ball.settings.airFactor;

    if (
      this.y == canvas.height - Ball.radius &&
      Math.abs(this.velocity.y) <= 0.01
    ) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += Ball.settings.gravity;
    }
  }
}

interface Point {
  x: number;
  y: number;
}

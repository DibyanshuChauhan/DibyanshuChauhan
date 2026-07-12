const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restart");
const speedInput = document.getElementById("speed");

const grid = 20;
let snake = [{ x: 6, y: 6 }];
let dir = { x: 1, y: 0 };
let apple = { x: 10, y: 10 };
let speed = 6;
let timer = 0;

function reset() {
  snake = [{ x: 6, y: 6 }];
  dir = { x: 1, y: 0 };
  apple = { x: 10, y: 10 };
  speed = parseInt(speedInput.value);
  timer = 0;
}

function placeApple() {
  apple = {
    x: Math.floor(Math.random() * (canvas.width / grid)),
    y: Math.floor(Math.random() * (canvas.height / grid)),
  };
}

function loop(ts) {
  timer += 1;
  if (timer % Math.max(1, 12 - speed) === 0) {
    // move
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    // wrap
    head.x = (head.x + canvas.width / grid) % (canvas.width / grid);
    head.y = (head.y + canvas.height / grid) % (canvas.height / grid);

    // check self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      // reset shorter snake
      snake = snake.slice(0, 3);
    }

    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
      placeApple();
    } else {
      snake.pop();
    }
  }

  draw();
  requestAnimationFrame(loop);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // background grid
  ctx.fillStyle = "#021225";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // apple
  ctx.fillStyle = "#ff5f6d";
  ctx.fillRect(apple.x * grid + 2, apple.y * grid + 2, grid - 4, grid - 4);

  // snake
  for (let i = 0; i < snake.length; i++) {
    const s = snake[i];
    ctx.fillStyle = i === 0 ? "#34d399" : "#10b98188";
    ctx.fillRect(s.x * grid + 1, s.y * grid + 1, grid - 2, grid - 2);
  }
}

window.addEventListener("keydown", (e) => {
  const k = e.key;
  if (k === "ArrowUp" && dir.y !== 1) dir = { x: 0, y: -1 };
  if (k === "ArrowDown" && dir.y !== -1) dir = { x: 0, y: 1 };
  if (k === "ArrowLeft" && dir.x !== 1) dir = { x: -1, y: 0 };
  if (k === "ArrowRight" && dir.x !== -1) dir = { x: 1, y: 0 };
});

restartBtn.addEventListener("click", () => reset());
speedInput.addEventListener(
  "input",
  () => (speed = parseInt(speedInput.value)),
);

placeApple();
requestAnimationFrame(loop);

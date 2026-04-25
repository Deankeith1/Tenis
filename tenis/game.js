const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

let score = 0;
let lives = 3;

const paddle = {
  x: width/2 - 50,
  y: height - 40,
  width: 100,
  height: 15,
  speed: 7,
  dx: 0
};

const balls = [];

function createBall() {
  const x = Math.random() * (width - 30) + 15;
  balls.push({
    x,
    y: -20,
    radius: 15,
    speed: 3 + Math.random() * 2
  });
}

function drawPaddle() {
  ctx.fillStyle = '#00aaff';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.fillStyle = '#ff5555';
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function movePaddle() {
  paddle.x += paddle.dx;
  if(paddle.x < 0) paddle.x = 0;
  if(paddle.x + paddle.width > width) paddle.x = width - paddle.width;
}

function updateBalls() {
  balls.forEach((ball, index) => {
    ball.y += ball.speed;

    // Top raketle çarpışma
    if(ball.y + ball.radius > paddle.y && 
       ball.x > paddle.x && 
       ball.x < paddle.x + paddle.width) {
      score++;
      balls.splice(index,1);
      createBall();
    }
    // Top yere düşerse
    else if(ball.y - ball.radius > height) {
      lives--;
      balls.splice(index,1);
      createBall();
      if(lives <= 0) {
        alert(`Oyun bitti! Puanınız: ${score}`);
        document.location.reload();
      }
    }
  });
}

function updateScoreboard() {
  document.getElementById('scoreboard').textContent = `Puan: ${score} | Can: ${lives}`;
}

function gameLoop() {
  ctx.clearRect(0, 0, width, height);

  drawPaddle();

  balls.forEach(drawBall);

  movePaddle();
  updateBalls();
  updateScoreboard();

  requestAnimationFrame(gameLoop);
}

// Klavye kontrolü
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowLeft') paddle.dx = -paddle.speed;
  else if(e.key === 'ArrowRight') paddle.dx = paddle.speed;
});
document.addEventListener('keyup', e => {
  if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') paddle.dx = 0;
});

// İmleçle kontrol (opsiyonel)
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.width/2;
  if(paddle.x < 0) paddle.x = 0;
  if(paddle.x + paddle.width > width) paddle.x = width - paddle.width;
});

// Başlangıç toplarını oluştur
for(let i=0; i<3; i++) createBall();

// Oyunu başlat
gameLoop();

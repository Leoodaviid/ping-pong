const canvasEl = document.querySelector("canvas"),
  canvasCtx = canvasEl.getContext("2d"),
  gapX = 10;

let gameStarted = false;
let countdown = 3;
let winner = null;

const mouse = {
  x: 0,
  y: 0,
};

const margin = 90;

const field = {
  w: window.innerWidth - 2 * margin,
  h: window.innerHeight - 2 * margin,
  draw: function () {
    // Desenhar a margem
    canvasCtx.fillStyle = "#01341d";
    canvasCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Desenhar o campo
    canvasCtx.fillStyle = "#286047";
    canvasCtx.fillRect(margin, margin, this.w, this.h);
  },
};

const line = {
  w: 15,
  h: window.innerHeight - 2 * margin,
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(
      field.w / 2 + margin - this.w / 2,
      margin,
      this.w,
      this.h
    );
  },
};

const leftPaddle = {
  x: margin + gapX,
  y: margin,
  w: 15,
  h: 200,
  _move: function () {
    this.y = mouse.y - this.h / 2;
    if (this.y < margin) this.y = margin;
    if (this.y + this.h > field.h + margin) this.y = field.h + margin - this.h;
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

const rightPaddle = {
  x: window.innerWidth - margin - gapX - 15,
  y: margin,
  w: 15,
  h: 200,
  speed: 5,
  _move: function () {
    if (this.y + this.h / 2 < ball.y) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
    if (this.y < margin) this.y = margin;
    if (this.y + this.h > field.h + margin) this.y = field.h + margin - this.h;
  },
  _speedUp: function () {
    this.speed += 2;
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

const score = {
  human: 0,
  computer: 0,
  increaseHuman: function () {
    this.human++;
  },
  increaseComputer: function () {
    this.computer++;
  },
  draw: function () {
    canvasCtx.font = "bold 72px Arial";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "top";
    canvasCtx.fillStyle = "#01341d";
    canvasCtx.fillText(this.human, field.w / 4 + margin, margin + 50);
    canvasCtx.fillText(this.computer, (3 * field.w) / 4 + margin, margin + 50);
  },
  reset: function () {
    this.human = 0;
    this.computer = 0;
  },
};

const ball = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  r: 20,
  speed: 4,
  directionX: 1,
  directionY: 1,
  _calcPosition: function () {
    if (this.x > field.w - this.r + margin - rightPaddle.w - gapX) {
      if (
        this.y + this.r > rightPaddle.y &&
        this.y - this.r < rightPaddle.y + rightPaddle.h
      ) {
        this._reverseX();
      } else {
        score.increaseHuman();
        this._pointUp();
      }
    }
    if (this.x < this.r + leftPaddle.w + gapX + margin) {
      if (
        this.y + this.r > leftPaddle.y &&
        this.y - this.r < leftPaddle.y + leftPaddle.h
      ) {
        this._reverseX();
      } else {
        score.increaseComputer();
        this._pointUp();
      }
    }
    if (
      (this.y - this.r < margin && this.directionY < 0) ||
      (this.y + this.r > field.h + margin && this.directionY > 0)
    ) {
      this._reverseY();
    }
  },
  _reverseX: function () {
    this.directionX *= -1;
  },
  _reverseY: function () {
    this.directionY *= -1;
  },
  _speedUp: function () {
    this.speed += 2;
  },
  _pointUp: function () {
    this._speedUp();
    rightPaddle._speedUp();
    this.x = field.w / 2 + margin;
    this.y = field.h / 2 + margin;
    gameStarted = false;
    countdown = 3;
    startCountdown();
  },
  _move: function () {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  draw: function () {
    // Desenhar a bola
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.beginPath();
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    canvasCtx.fill();

    // Desenhar detalhes da bola (costuras)
    canvasCtx.strokeStyle = "#000000";
    canvasCtx.lineWidth = 2;

    // Desenhar a primeira costura
    canvasCtx.beginPath();
    canvasCtx.arc(
      this.x,
      this.y,
      this.r - 3,
      0.25 * Math.PI,
      1.25 * Math.PI,
      false
    );
    canvasCtx.stroke();

    // Desenhar a segunda costura
    canvasCtx.beginPath();
    canvasCtx.arc(
      this.x,
      this.y,
      this.r - 3,
      1.75 * Math.PI,
      0.75 * Math.PI,
      false
    );
    canvasCtx.stroke();

    if (gameStarted) {
      this._calcPosition();
      this._move();
    }
  },
};

// Adicionar botões de iniciar e resetar
const buttons = {
  startButton: {
    x: window.innerWidth / 2 - 210,
    y: window.innerHeight - margin + 20,
    w: 200,
    h: 50,
    draw: function () {
      canvasCtx.fillStyle = "#286047";
      canvasCtx.fillRect(this.x, this.y, this.w, this.h);
      canvasCtx.fillStyle = "#ffffff";
      canvasCtx.font = "bold 24px Arial";
      canvasCtx.textAlign = "center";
      canvasCtx.textBaseline = "middle";
      canvasCtx.fillText("Iniciar", this.x + this.w / 2, this.y + this.h / 2);
    },
    onClick: function () {
      resetGame();
      startCountdown();
    },
  },
  resetButton: {
    x: window.innerWidth / 2 + 10,
    y: window.innerHeight - margin + 20,
    w: 200,
    h: 50,
    draw: function () {
      canvasCtx.fillStyle = "#286047";
      canvasCtx.fillRect(this.x, this.y, this.w, this.h);
      canvasCtx.fillStyle = "#ffffff";
      canvasCtx.font = "bold 24px Arial";
      canvasCtx.textAlign = "center";
      canvasCtx.textBaseline = "middle";
      canvasCtx.fillText("Resetar", this.x + this.w / 2, this.y + this.h / 2);
    },
    onClick: function () {
      resetGame();
    },
  },
};

function setup() {
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
}

function draw() {
  field.draw();
  line.draw();
  leftPaddle.draw();
  rightPaddle.draw();
  score.draw();
  ball.draw();
  buttons.startButton.draw();
  buttons.resetButton.draw();
}

function drawCountdown() {
  field.draw();
  line.draw();
  score.draw();
  buttons.startButton.draw();
  buttons.resetButton.draw();
  canvasCtx.font = "bold 144px Arial";
  canvasCtx.textAlign = "center";
  canvasCtx.textBaseline = "middle";
  canvasCtx.fillStyle = "#01341d";
  canvasCtx.fillText(countdown, window.innerWidth / 2, window.innerHeight / 2);
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function main() {
  if (gameStarted) {
    draw();
  } else if (countdown > 0) {
    drawCountdown();
  } else {
    draw();
  }
  animateFrame(main);
}

function startCountdown() {
  let countdownInterval = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      gameStarted = true;
    }
  }, 1000);
}

function resetGame() {
  gameStarted = false;
  countdown = 3;
  winner = null;
  score.reset();
  ball.speed = 4;
  rightPaddle.speed = 5;
  ball.x = field.w / 2 + margin;
  ball.y = field.h / 2 + margin;
  leftPaddle.y = margin;
  rightPaddle.y = margin;
}

setup();
main();

canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});

canvasEl.addEventListener("click", function (e) {
  const rect = canvasEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (
    x > buttons.startButton.x &&
    x < buttons.startButton.x + buttons.startButton.w &&
    y > buttons.startButton.y &&
    y < buttons.startButton.y + buttons.startButton.h
  ) {
    buttons.startButton.onClick();
  }

  if (
    x > buttons.resetButton.x &&
    x < buttons.resetButton.x + buttons.resetButton.w &&
    y > buttons.resetButton.y &&
    y < buttons.resetButton.y + buttons.resetButton.h
  ) {
    buttons.resetButton.onClick();
  }
});

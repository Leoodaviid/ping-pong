const canvasEl = document.querySelector("canvas"),
    canvasCtx = canvasEl.getContext("2d"),
    gapX = 10

const mouse = {
    x: 0,
    y: 0
}

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        canvasCtx.fillStyle = "#286047"
        canvasCtx.fillRect(0, 0, this.w, this.h)
    },
}

const line = {
    w: 15,
    h: field.h,
    draw: function () {
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    },
}

const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function () {
        this.y = mouse.y - this.h / 2
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    },
}

const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 100,
    w: line.w,
    h: 200,
    _move: function () {
        this.y = ball.y
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    },
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++
    },
    increaseComputer: function () {
        this.computer++
    },
    draw: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341d"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50)
    }
}

const ball = {
    x: 0,
    y: 0,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function () {
        // verifica se o jogador 1 fez um ponto (x > largura do campo)
        if (this.x > field.w - this.r - rightPaddle.w - gapX) {
            // verifica se a raquete direita está na posição da bola
            if (this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h) {
                // rebate a bola invertendo o sinal de x
                this._reverseX()
            } else {
                // pontuar o jogador 1
                score.increaseHuman()
                this._pointUp()
            }
        }
        // verifica se o jogador 2 fez um ponto(x < 0)
        if (this.x < this.r + leftPaddle.w + gapX) {
            // verifica se a raquete esquerda esta na posição y da bola
            if (this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
                // rebate a bola invertendo o sinal de x
                this._reverseX()
            } else {
                // pontuar o jogador 2
                score.increaseComputer()
                this._pointUp()
            }
        }

        // verifica as laterais superior e inferior do campo
        if (
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)) {

            // rebate a bola invertendo o sinal do eixo y    
            this._reverseY()
        }
    },
    _reverseX: function () {
        // 1 * -1 = -1 
        // -1 * -1 = 1
        this.directionX *= -1
    },
    _reverseY: function () {
        this.directionY *= -1
    },
    _pointUp: function () {
        this.x = field.w / 2
        this.y = field.h / 2
    },
    _move: function () {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function () {
        canvasCtx.fillStyle = "#ffffff"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()
    }
}

function setup() {
    canvasEl.width = canvasCtx.width = field.w
    canvasEl.height = canvasCtx.height = field.h

}


function draw() {
    field.draw()
    line.draw()
    leftPaddle.draw()
    rightPaddle.draw()
    score.draw()
    ball.draw()
}



window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup()
main()
canvasEl.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
})
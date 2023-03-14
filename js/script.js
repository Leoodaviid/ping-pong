const canvasEl = document.querySelector("canvas"),
    canvasCtx = canvasEl.getContext("2d");

const lineWidth = 15


function setup() {
    canvasEl.width = canvasCtx.width = window.innerWidth
    canvasEl.height = canvasCtx.height = window.innerHeight

}


function draw() {
    canvasCtx.fillStyle = "#286047"
    canvasCtx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    canvasCtx.fillStyle = "#ffffff"

    const x = window.innerWidth / 2 - lineWidth / 2
    const y = 0
    const w = lineWidth
    const h = window.innerHeight

    canvasCtx.fillRect(x, y, w, h)
}




setup()
draw()
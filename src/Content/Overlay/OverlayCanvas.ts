import { OverlayLayer } from "./OverlayLayer"

export interface OverlayCanvasBounds {
    width: number
    height: number
    scale: number
}

export class OverlayCanvas {
    public canvas: HTMLCanvasElement
    public ctx: CanvasRenderingContext2D
    public bounds: OverlayCanvasBounds = {
        width: 320,
        height: 240,
        scale: 1
    }
    public layers: OverlayLayer[] = []

    public static renderInterval: number = 1000 / 60

    constructor() {
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
        this.canvas.classList.add("gamepad-navigator-overlay-canvas")
        this.canvas.style.zIndex = "99999999"
        this.canvas.style.pointerEvents = "none"
        this.canvas.style.userSelect = "none"
        this.canvas.style.position = "fixed"
        this.canvas.style.top = "0px"
        this.canvas.style.bottom = "0px"
        this.canvas.style.left = "0px"
        this.canvas.style.right = "0px"

        document.body.appendChild(this.canvas)
        setInterval(() => this.render(), OverlayCanvas.renderInterval)
    }

    private render() {
        this.bounds.width = window.innerWidth
        this.bounds.height = window.innerHeight
        this.canvas.width = this.bounds.width
        this.canvas.height = this.bounds.height
        this.ctx.clearRect(0, 0, this.bounds.width, this.bounds.height)
        for (let layer of this.layers) {
            this.ctx.setLineDash([0, 0])
            layer.render(this.ctx, this.bounds)
        }
    }

    public addLayer(layer: OverlayLayer) {
        this.layers.push(layer)
    }
}

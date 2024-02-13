import { Bounds } from "../../Common/Bounds";
import { AnchorLocation, Side } from "../../Common/Geometry";
import { OverlayCanvas, OverlayCanvasBounds } from "../OverlayCanvas";
import { OverlayLayer } from "../OverlayLayer";
import { BezierLine } from "../BezierLine";

export interface UIMapOverlayLink{
    from: {
        bounds: Bounds,
        side: Side,
        distanceScore: number,
        angleScore: number
    },
    to: {
        bounds: Bounds,
        side: Side,
        distanceScore: number,
        angleScore: number
    },
}

export class UIMapOverlay extends OverlayLayer {

  public link: UIMapOverlayLink[] = [];

  constructor() {
    super();
  }

  public render(ctx: CanvasRenderingContext2D, bounds: OverlayCanvasBounds) {
    for(let links of this.link){
        ctx.strokeStyle = "#1B7AFB";
        ctx.fillStyle = "#1B7AFB";
        ctx.lineWidth = 2;
        BezierLine.draw(ctx, {
            start: links.from.bounds,
            startSide: links.from.side,
            startSymbol: "arrow",
            end: links.to.bounds,
            endSide: links.to.side,
            endSymbol: "arrow",
            topText: {
                content: links.from.angleScore === Number.MAX_VALUE ? "" : links.from.angleScore.toFixed(2)+"D "+links.from.distanceScore.toFixed(2)+"px",
                color: "blue"
            }
        })
    }
  }

  public renderBox(ctx: CanvasRenderingContext2D, box: Bounds) {
    let pos = box.getAnchor();
    let size = box.getSize();
    ctx.strokeStyle = "#5D4DB2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, size.width, size.height, 3);
    ctx.stroke();

    // ctx.fillStyle = "#5D4DB2";
    // let text = "Test Overlay";
    // let textHeight = 15;
    // let spacing = 10;
    // let textWidth = ctx.measureText(text).width;
    // ctx.beginPath();
    // ctx.roundRect(
    //   pos.x,
    //   pos.y - (spacing + textHeight),
    //   textWidth + spacing,
    //   textHeight,
    //   3
    // );
    // ctx.fill();
    // ctx.stroke();

    // ctx.fillStyle = "white";
    // ctx.font = textHeight - 5 + "px Arial";
    // ctx.fillText(text, pos.x + 5, pos.y - spacing * 1.5);
  }
}

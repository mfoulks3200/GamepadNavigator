import { Bounds } from "../../Common/Bounds";
import { Interactable } from "../../Interactable/Interactable";
import { OverlayCanvas, OverlayCanvasBounds } from "../OverlayCanvas";
import { OverlayLayer } from "../OverlayLayer";

export class TestOverlay extends OverlayLayer {

  public interactables: Interactable[] = [];

  constructor() {
    super();
    
  }

  public render(ctx: CanvasRenderingContext2D, bounds: OverlayCanvasBounds) {
    for(let interactable of this.interactables){
      this.renderBox(ctx, interactable.bounds, interactable.interactable ? "rgb(130, 111, 219)" : "rgba(130, 111, 219, 0.5)", interactable.inactiveReason !== "active" ? interactable.inactiveReason : undefined);
    }
  }

  public renderBox(ctx: CanvasRenderingContext2D, box: Bounds, color: string = "#5D4DB2", text?: string) {
    let pos = box.getAnchor();
    let size = box.getSize();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.roundRect(pos.x, pos.y, size.width, size.height, 3);
    ctx.stroke();

    if(text === undefined) return;
    ctx.fillStyle = color;
    let textHeight = 15;
    let spacing = 10;
    let textWidth = ctx.measureText(text).width;
    ctx.beginPath();
    ctx.roundRect(
      pos.x,
      pos.y - (spacing + textHeight),
      textWidth + spacing,
      textHeight,
      3
    );
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = textHeight - 5 + "px Arial";
    ctx.fillText(text, pos.x + 5, pos.y - spacing * 1.5);
  }
}

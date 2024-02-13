import { Axis } from "../../Controllers/Axis";
import { Button } from "../../Controllers/Button";
import { Controller } from "../../Controllers/Controller";
import { Joystick } from "../../Controllers/Joystick";
import { Position } from "../../Common/Geometry";
import { OverlayCanvasBounds } from "../OverlayCanvas";
import { OverlayLayer } from "../OverlayLayer";

export class ControllerOverlay extends OverlayLayer {
  public controller: Controller;
  public buttonSize: number = 50;

  constructor(controller: Controller) {
    super();
    this.controller = controller;
  }

  public render(ctx: CanvasRenderingContext2D, bounds: OverlayCanvasBounds) {
    // let width = 50
    // let height = 50
    // let xMiddle = bounds.width / 2 - width / 2
    // let yMiddle = bounds.height / 2 - height / 2
    // let x = Math.sin(Date.now() / 250) * 100 + xMiddle
    // let y = Math.cos(Date.now() / 250) * 100 + yMiddle
    // ctx.fillStyle = "rgba(255, 0, 0, 1)"
    // ctx.fillRect(x, y, width, height)
    // console.log(this.controller.buttons.map(b => b.pressed))

    let buttonWidth = 35;
    for (let i = 0; i < this.controller.buttons.length; i++) {
      this.drawControl(
        ctx,
        bounds,
        {
          x: bounds.width - 25 - buttonWidth * i,
          y: bounds.height - 25,
        },
        this.controller.buttons[i]
      );
    }

    let axisWidth = 40;
    let lastAxisX = 0;
    for (let i = 0; i < this.controller.axes.length; i++) {
      let axis = this.controller.axes[i];
      let center = {
        x: bounds.width - 25 - axisWidth * i,
        y: bounds.height - 100,
      };
      lastAxisX = bounds.width - 25 - (axisWidth + 5) * i;
      this.drawAxis(ctx, bounds, center, axis);
    }

    lastAxisX -= 57;
    let JoystickWidth = 100;
    for (let i = 0; i < this.controller.joysticks.length; i++) {
      let joystick = this.controller.joysticks[i];
      let center = {
        x: lastAxisX - (JoystickWidth + 5) * i,
        y: bounds.height - 100,
      };
      this.draw2DAxis(ctx, bounds, center, joystick);
    }
  }

  public draw2DAxis(
    ctx: CanvasRenderingContext2D,
    bounds: OverlayCanvasBounds,
    center: Position,
    joystick: Joystick
  ) {
    let width = 100;
    let height = 100;
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.roundRect(
      center.x - width / 2,
      center.y - height / 2,
      width,
      height,
      5
    );
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.rotate((Math.PI / 180) * 90);
    ctx.textAlign = "right";
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillText(
      "Stick " + joystick.label.split(" ")[1],
      center.y + 32,
      -center.x + 40
    );
    ctx.restore();

    ctx.fillStyle = "rgba(255,0,0,0.25)";
    ctx.beginPath();
    ctx.arc(
      center.x,
      center.y,
      Joystick.deadzone * width,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(
      center.x + (joystick.vector.x * width) / 2,
      center.y - height / 2
    );
    ctx.lineTo(
      center.x + (joystick.vector.x * width) / 2,
      center.y + height / 2
    );
    ctx.stroke();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(
      center.x - width / 2,
      center.y + (joystick.vector.y * height) / 2
    );
    ctx.lineTo(
      center.x + width / 2,
      center.y + (joystick.vector.y * height) / 2
    );
    ctx.stroke();
  }

  public drawAxis(
    ctx: CanvasRenderingContext2D,
    bounds: OverlayCanvasBounds,
    center: Position,
    axis: Axis
  ) {
    let width = 35;
    let height = 100;
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.roundRect(
      center.x - width / 2,
      center.y - height / 2,
      width,
      height,
      5
    );
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.rotate((Math.PI / 180) * 90);
    ctx.textAlign = "right";
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillText("Axis " + axis.label, center.y + 28, -center.x + 8);
    ctx.restore();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(center.x - width / 2, center.y + (axis.value * height) / 2);
    ctx.lineTo(center.x + width / 2, center.y + (axis.value * height) / 2);
    ctx.stroke();
  }

  public drawControl(
    ctx: CanvasRenderingContext2D,
    bounds: OverlayCanvasBounds,
    center: Position,
    button: Button
  ) {
    this.drawButton(ctx, bounds, center, button);
    let profile = button.getProfileButton();
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = profile?.color || "white";
    ctx.fillText(
      button.getName(),
      center.x + (button.pressed ? 1 : 0),
      center.y + (button.pressed ? 1 : 0) + 4
    );
  }

  public drawButton(
    ctx: CanvasRenderingContext2D,
    bounds: OverlayCanvasBounds,
    center: Position,
    button: Button
  ) {
    ctx.strokeStyle = "rgba(0,0,0,0.9)";
    if (button.pressed) {
      ctx.fillStyle = "rgba(0,0,0,0.9)";
    } else {
      ctx.fillStyle = "rgba(0,0,0,0.75)";
    }
    ctx.beginPath();
    ctx.arc(
      center.x + (button.pressed ? 1 : 0),
      center.y + (button.pressed ? 1 : 0),
      15 - (button.pressed ? 2 : 0),
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

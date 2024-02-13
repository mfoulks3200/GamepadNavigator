import { Bounds } from "../../Common/Bounds";
import { AnchorLocation, Side } from "../../Common/Geometry";
import { OverlayCanvas, OverlayCanvasBounds } from "../OverlayCanvas";
import { OverlayLayer } from "../OverlayLayer";
import { BezierLine } from "../BezierLine";

export interface KeyboardOverlayKey {
    width?: number,
    primaryLabel?: string,
    secondaryLabel?: string
}

export const keyboardOverlayLayout: KeyboardOverlayKey[][] = [
    [
        {
            secondaryLabel: "~",
            primaryLabel: "`"
        },
        {
            secondaryLabel: "!",
            primaryLabel: "1"
        },
        {
            secondaryLabel: "@",
            primaryLabel: "2"
        },
        {
            secondaryLabel: "#",
            primaryLabel: "3"
        },
        {
            secondaryLabel: "$",
            primaryLabel: "4"
        },
        {
            secondaryLabel: "%",
            primaryLabel: "5"
        },
        {
            secondaryLabel: "^",
            primaryLabel: "6"
        },
        {
            secondaryLabel: "&",
            primaryLabel: "7"
        },
        {
            secondaryLabel: "*",
            primaryLabel: "8"
        },
        {
            secondaryLabel: "(",
            primaryLabel: "9"
        },
        {
            secondaryLabel: ")",
            primaryLabel: "0"
        },
        {
            secondaryLabel: "_",
            primaryLabel: "-"
        },
        {
            secondaryLabel: "+",
            primaryLabel: "="
        },
        { width: 2, primaryLabel: "Bksp" }
    ],
    [
        { width: 1.5, primaryLabel: "Tab" },
        { primaryLabel: "Q" },
        { primaryLabel: "W" },
        { primaryLabel: "E" },
        { primaryLabel: "R" },
        { primaryLabel: "T" },
        { primaryLabel: "Y" },
        { primaryLabel: "U" },
        { primaryLabel: "I" },
        { primaryLabel: "O" },
        { primaryLabel: "P" },
        {
            secondaryLabel: "{",
            primaryLabel: "["
        },
        {
            secondaryLabel: "}",
            primaryLabel: "]"
        },
        {
            width: 1.5,
            secondaryLabel: "|",
            primaryLabel: "\\"
        }
    ],
    [
        { width: 1.75, primaryLabel: "Caps" },
        { primaryLabel: "A" },
        { primaryLabel: "S" },
        { primaryLabel: "D" },
        { primaryLabel: "F" },
        { primaryLabel: "G" },
        { primaryLabel: "H" },
        { primaryLabel: "J" },
        { primaryLabel: "K" },
        { primaryLabel: "L" },
        {
            secondaryLabel: ":",
            primaryLabel: ";"
        },
        {
            secondaryLabel: "\"",
            primaryLabel: "'"
        },
        { width: 2.25, primaryLabel: "Enter" }
    ],
    [
        { width: 2.25, primaryLabel: "Shift" },
        { primaryLabel: "Z" },
        { primaryLabel: "X" },
        { primaryLabel: "C" },
        { primaryLabel: "V" },
        { primaryLabel: "B" },
        { primaryLabel: "N" },
        { primaryLabel: "M" },
        {
            secondaryLabel: "<",
            primaryLabel: ","
        },
        {
            secondaryLabel: ">",
            primaryLabel: "."
        },
        {
            secondaryLabel: "?",
            primaryLabel: "/"
        },
        { width: 2.75, primaryLabel: "Shift" },
    ],
    [
        { width: 1.25, primaryLabel: "Ctrl" },
        { width: 1.25, primaryLabel: "Win" },
        { width: 1.25, primaryLabel: "Alt" },
        { width: 6.25 },
        { width: 1.25, primaryLabel: "Alt" },
        { width: 1.25, primaryLabel: "Win" },
        { width: 1.25, primaryLabel: "Menu" },
        { width: 1.25, primaryLabel: "Ctrl" }
    ]
];


export class KeyboardOverlay extends OverlayLayer {

    private static keySpacing: number = 10;
    public static keyboardActive = false;

    constructor() {
        super();
    }

    public render(ctx: CanvasRenderingContext2D, bounds: OverlayCanvasBounds) {
        if (!KeyboardOverlay.keyboardActive) return;
        let keyboardBounds = new Bounds(
            {
                x: 0,
                y: bounds.height - 310,
            },
            {
                width: 800,
                height: 300
            }
        )
        if (bounds.width < keyboardBounds.getSize().width) {
            keyboardBounds.setSize({ width: bounds.width, height: bounds.width * 0.375 })
            keyboardBounds.setPos({ x: 0, y: bounds.height - (bounds.width * 0.375) })
        } else {
            keyboardBounds.setPos({ x: (bounds.width / 2) - (keyboardBounds.getSize().width / 2), y: keyboardBounds.getAnchor().y })
        }
        KeyboardOverlay.keySpacing = keyboardBounds.getSize().width / 80;
        ctx.beginPath();
        ctx.fillStyle = "rgba(30, 30, 30, 0.95)";
        ctx.roundRect(keyboardBounds.getAnchor().x, keyboardBounds.getAnchor().y, keyboardBounds.getSize().width, keyboardBounds.getSize().height, 10);
        ctx.fill();
        let rowIndex = 0;
        for (let keyRow of keyboardOverlayLayout) {
            let rowSpaceHeight = (keyboardBounds.getSize().height - KeyboardOverlay.keySpacing)
            let rowHeight = (rowSpaceHeight / keyboardOverlayLayout.length) - KeyboardOverlay.keySpacing

            let rowOffset = (rowHeight + KeyboardOverlay.keySpacing) * rowIndex

            let rowBounds = new Bounds({
                x: keyboardBounds.getAnchor().x + KeyboardOverlay.keySpacing,
                y: (keyboardBounds.getAnchor().y + KeyboardOverlay.keySpacing) + rowOffset
            }, {
                width: keyboardBounds.getSize().width,
                height: rowHeight
            })
            let keyIndex = 0;
            let lastXPos = rowBounds.getAnchor().x;
            let totalWidth = 0;
            for (let key of keyRow) {
                totalWidth += key.width ?? 1;
            }
            for (let key of keyRow) {
                let allSpacing = (keyRow.length + 1) * KeyboardOverlay.keySpacing
                let keyWidth = ((rowBounds.getSize().width - allSpacing) / totalWidth)

                let keyBounds = new Bounds({
                    x: lastXPos,
                    y: rowBounds.getAnchor().y
                }, {
                    width: keyWidth * (key.width ?? 1),
                    height: rowBounds.getSize().height
                })
                this.renderKey(ctx, keyboardBounds, keyBounds, key);
                lastXPos = lastXPos + (keyWidth * (key.width ?? 1)) + KeyboardOverlay.keySpacing;
                keyIndex++;
            }
            rowIndex++;
        }
    }

    public renderKey(ctx: CanvasRenderingContext2D, box: Bounds, keyBounds: Bounds, key: KeyboardOverlayKey) {
        ctx.fillStyle = "rgba(250, 250, 250, 0.95)";
        ctx.beginPath();
        ctx.roundRect(keyBounds.getAnchor().x, keyBounds.getAnchor().y, keyBounds.getSize().width, keyBounds.getSize().height, 5);
        ctx.fill();
        ctx.fillStyle = "rgba(50, 50, 50, 1)";
        ctx.font = "Bold " + (box.getSize().width / 50) + "px SF Pro Display";
        ctx.textAlign = "center";
        ctx.fillText(key.primaryLabel ?? "", keyBounds.getAnchor({ x: 0.5, y: 0.85 }).x, keyBounds.getAnchor({ x: 0.5, y: 0.85 }).y);
        ctx.fillStyle = "rgba(50, 50, 50, 0.75)";
        ctx.font = "Bold " + (box.getSize().width / 60) + "px SF Pro Display";
        ctx.textAlign = "center";
        ctx.fillText(key.secondaryLabel ?? "", keyBounds.getAnchor({ x: 0.5, y: 0.35 }).x, keyBounds.getAnchor({ x: 0.5, y: 0.35 }).y);
    }
}

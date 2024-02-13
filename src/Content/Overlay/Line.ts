import { Bounds } from "../Common/Bounds";
import { AnchorLocation, Position, Side } from "../Common/Geometry";

export type LineSymbol = "arrow" | "none";

export interface LineProps{
    start: Bounds
    startSide: Side
    startSymbol?: LineSymbol

    end: Bounds
    endSide: Side
    endSymbol?: LineSymbol

    topText?: {
        content: string
        color: string
    }
    bottomText?: {
        content: string
        color: string
    }
}

export class Line{

    public static symbolSize = 10;

    protected static getPositionFromSide(bounds: Bounds, side: Side, offset: number = 0): Position{
        let pos = bounds.getAnchor(side as string as AnchorLocation);
        return pos;
    }

    protected static getOffsetFromSide(side: Side, offset: number = 0): Position{
        let offsetPos: Position = { x: 0, y: 0 };
        if(side === Side.Top){
            offsetPos = { x: 0, y: -offset }
        }else if(side === Side.Left){
            offsetPos = { x: -offset, y: 0 }
        }else if(side === Side.Right){
            offsetPos = { x: offset, y: 0 }
        }else if(side === Side.Bottom){
            offsetPos = { x: 0, y: offset }
        }
        return offsetPos;
    }

    protected static drawArrow(ctx: CanvasRenderingContext2D, pos: Position, side: Side, size: number){
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        if(side === Side.Top){
            ctx.lineTo(pos.x - (size/2), pos.y - size);
            ctx.lineTo(pos.x + (size/2), pos.y - size);
            ctx.lineTo(pos.x, pos.y);
        }else if(side === Side.Left){
            ctx.lineTo(pos.x - size, pos.y - (size/2));
            ctx.lineTo(pos.x - size, pos.y + (size/2));
            ctx.lineTo(pos.x, pos.y);
        }else if(side === Side.Right){
            ctx.lineTo(pos.x + size, pos.y - (size/2));
            ctx.lineTo(pos.x + size, pos.y + (size/2));
            ctx.lineTo(pos.x, pos.y);
        }else if(side === Side.Bottom){
            ctx.lineTo(pos.x - (size/2), pos.y + size);
            ctx.lineTo(pos.x + (size/2), pos.y + size);
            ctx.lineTo(pos.x, pos.y);
        }
        ctx.fill();

    }

    public static draw(ctx: CanvasRenderingContext2D, line: LineProps){
        let startPos: Position = Line.getPositionFromSide(line.start, line.startSide, Line.symbolSize);
        let endPos: Position = Line.getPositionFromSide(line.end, line.endSide, Line.symbolSize);
        let startOffset: Position = Line.getOffsetFromSide(line.startSide, Line.symbolSize);
        let endOffset: Position = Line.getOffsetFromSide(line.endSide, Line.symbolSize);
        ctx.beginPath();
        ctx.moveTo(startPos.x + startOffset.x, startPos.y + startOffset.y);
        ctx.lineTo(endPos.x + endOffset.x, endPos.y + endOffset.y);
        ctx.stroke();
        if(line.startSymbol === "arrow"){
            Line.drawArrow(ctx, startPos, line.startSide, Line.symbolSize);
        }
        if(line.endSymbol === "arrow"){
            Line.drawArrow(ctx, endPos, line.endSide, Line.symbolSize);
        }
    }
}
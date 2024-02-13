import { Bounds } from "../Common/Bounds"
import { Position, Side, addPosition, distance, getAngleTo, moveInDirection } from "../Common/Geometry"
import { Line, LineProps, LineSymbol } from "./Line"

export class BezierLine extends Line{
    
    public static draw(ctx: CanvasRenderingContext2D, line: LineProps){
        let startPos: Position = Line.getPositionFromSide(line.start, line.startSide, Line.symbolSize);
        let endPos: Position = Line.getPositionFromSide(line.end, line.endSide, Line.symbolSize);

        let startOffset: Position = Line.getOffsetFromSide(line.startSide, Line.symbolSize);
        let endOffset: Position = Line.getOffsetFromSide(line.endSide, Line.symbolSize);

        let startCpOffset: Position = Line.getOffsetFromSide(line.startSide, distance(startPos, endPos) / 4);
        let endCpOffset: Position = Line.getOffsetFromSide(line.endSide, distance(startPos, endPos) / 4);

        let startCPos = { x: addPosition(startPos, startOffset).x + startCpOffset.x, y: addPosition(startPos, startOffset).y + startCpOffset.y};
        let endCPos = { x: addPosition(endPos, endOffset).x + endCpOffset.x, y: addPosition(endPos, endOffset).y + endCpOffset.y};

        ctx.beginPath();
        ctx.moveTo(startPos.x + startOffset.x, startPos.y + startOffset.y);
        ctx.bezierCurveTo(startCPos.x, startCPos.y, endCPos.x, endCPos.y, endPos.x + endOffset.x, endPos.y + endOffset.y);
        ctx.stroke();
        if(line.startSymbol === "arrow"){
            Line.drawArrow(ctx, startPos, line.startSide, Line.symbolSize);
        }
        if(line.endSymbol === "arrow"){
            Line.drawArrow(ctx, endPos, line.endSide, Line.symbolSize);
        }
        let startMiddlePos = { x: (startPos.x + startCPos.x) / 2, y: (startPos.y + startCPos.y) / 2};
        let endMiddlePos = { x: (endPos.x + endCPos.x) / 2, y: (endPos.y + endCPos.y) / 2};
        let middlePos: Position = {x: (startCPos.x + endCPos.x) / 2, y: ((startCPos.y + endCPos.y) / 2)};
        if(line.topText){
            let textAngle = (getAngleTo(startMiddlePos, endMiddlePos)+90)%360;
            let textPos = moveInDirection(middlePos, -((textAngle+90)%360), 8);
            ctx.save();
            ctx.translate(textPos.x, textPos.y);
            ctx.rotate(-(textAngle*(Math.PI/180)));
            ctx.fillStyle = line.topText.color;
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(line.topText.content, 0, 0);
            ctx.restore();
        }
    }
}
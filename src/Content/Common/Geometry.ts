export interface Position{
    x: number
    y: number
}

export const addPosition = (pos1: Position, pos2: Position): Position => {
    return { x: pos1.x + pos2.x, y: pos1.y + pos2.y }
}

export const moveInDirection = (pos: Position, angle: number, distance: number): Position => {
    let x = pos.x + distance * Math.cos(angle * Math.PI / 180)
    let y = pos.y + distance * Math.sin(angle * Math.PI / 180)
    return { x: x, y: y }
}

export const distance = (pos1: Position, pos2: Position): number => {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2))
}

export const getAngleTo = (pos1: Position, pos2: Position): number => {
    var dy = pos2.y - pos1.y;
    var dx = pos2.x - pos1.x;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return ((360-theta)+270)%360;

}

export const sideToOpposite = (side: Side): Side => {
    if(side === Side.Top){
        return Side.Bottom
    }else if(side === Side.Left){
        return Side.Right
    }else if(side === Side.Right){
        return Side.Left
    }else if(side === Side.Bottom){
        return Side.Top
    }else{
        return Side.Top
    }

}

export interface Dimension{
    width: number
    height: number
}

export interface Anchor{
    x: number
    y: number
}

export enum Side{
    Top="Top",
    Left="Left",
    Right="Right",
    Bottom="Bottom",
}

export const sideToRange = (side: Side): AngleRange => {
    if(side === Side.Top){
        return { start: 315, end: 45 }
    }else if(side === Side.Left){
        return { start: 45, end: 135 }
    }else if(side === Side.Right){
        return { start: 225, end: 315 }
    }else if(side === Side.Bottom){
        return { start: 135, end: 225 }
    }else{
        return { start: 0, end: 0 }
    }
}

export interface AngleRange{
    start: number
    end: number
}

export const angleInRange = (angle: number, range: AngleRange): number => {
    if(angle < 0){
        angle += 360
    }
    angle = angle % 360
    if(range.start > range.end){
        let span = (range.end+360) - range.start
        let mid = (range.start + (span / 2)) % 360
        return Math.abs(angle - mid)
    }else{
        let span = range.end - range.start
        let mid = range.start + (span / 2)
        return Math.abs(angle - mid)
    }
}

export const withinRange = (val: number, max: number, min: number): boolean => {
    return val >= min && val <= max
}

export const normalizeAngle = (angle: number): number => {
    return (angle + (360*10)) % 360
}

export enum AnchorLocation{
    TopLeft="TopLeft",
    Top="Top",
    TopRight="TopRight",
    Left="Left",
    Middle="Middle",
    Right="Right",
    BottomLeft="BottomLeft",
    Bottom="Bottom",
    BottomRight="BottomRight"
}
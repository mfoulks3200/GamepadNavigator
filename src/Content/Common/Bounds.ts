import { Position, Dimension, Anchor, AnchorLocation } from './Geometry'

export class Bounds {
    private pos: Position
    private size: Dimension
    private linkedElement?: HTMLElement

    private static anchors = {
        [AnchorLocation.TopLeft]: { x: 0, y: 0 },
        [AnchorLocation.Top]: { x: 0.5, y: 0 },
        [AnchorLocation.TopRight]: { x: 1, y: 0 },
        [AnchorLocation.Left]: { x: 0, y: 0.5 },
        [AnchorLocation.Middle]: { x: 0.5, y: 0.5 },
        [AnchorLocation.Right]: { x: 1, y: 0.5 },
        [AnchorLocation.BottomLeft]: { x: 0, y: 1 },
        [AnchorLocation.Bottom]: { x: 0.5, y: 1 },
        [AnchorLocation.BottomRight]: { x: 1, y: 1 }
    }

    constructor(pos: Position, dimensions: Dimension) {
        this.pos = pos
        this.size = dimensions
    }

    public static fromElement(element: HTMLElement): Bounds {
        let bound = new Bounds(
            Bounds.getElementPosition(element),
            Bounds.getElementSize(element)
        )
        bound.linkedElement = element
        return bound;
    }

    private static getElementPosition(element: HTMLElement){
        return { x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y }
    }

    private static getElementSize(element: HTMLElement){
        return { width: element.offsetWidth, height: element.offsetHeight }
    }

    private updateElementBounds(){
        if(this.linkedElement){
            this.pos = Bounds.getElementPosition(this.linkedElement)
            this.size = Bounds.getElementSize(this.linkedElement)
        }
    }

    public getAnchor(anchor?: Anchor | AnchorLocation): Position{
        this.updateElementBounds();
        if(!anchor){
            return this.pos;
        }else if(typeof anchor === 'string'){
            let anchors: Anchor = Bounds.anchors[anchor]
            return this.getAnchor(anchors)
        }else{
            return {
                x: this.pos.x + (this.size.width * anchor.x),
                y: this.pos.y + (this.size.height * anchor.y)
            }
        }
    }

    public getSize(): Dimension{
        this.updateElementBounds();
        return this.size
    }

    public getSquareSize(): number{
        return this.size.width * this.size.height
    }

    public getAspectRatio(): number{
        return Math.min(this.size.width, this.size.height) / Math.max(this.size.width, this.size.height)
    }

    public getOnscreenBounds(){
        return this.getOverlappingBounds(Bounds.screenBounds());
    }

    public getOnscreenPercentage(): number{
        let onscreenBounds = this.getOnscreenBounds()
        let onscreenSquareSize = onscreenBounds.getSquareSize()/this.getSquareSize();
        return onscreenSquareSize
    }

    public getOverlappingBounds(otherBounds: Bounds): Bounds{
        let x = Math.max(this.pos.x, otherBounds.pos.x)
        let y = Math.max(this.pos.y, otherBounds.pos.y)
        let width = Math.min(this.pos.x + this.size.width, otherBounds.pos.x + otherBounds.size.width) - x
        let height = Math.min(this.pos.y + this.size.height, otherBounds.pos.y + otherBounds.size.height) - y
        return new Bounds({ x, y }, { width, height })
    }

    public static screenBounds(): Bounds{
        return new Bounds({ x: 0, y: 0 }, { width: window.innerWidth, height: window.innerHeight })
    }
}
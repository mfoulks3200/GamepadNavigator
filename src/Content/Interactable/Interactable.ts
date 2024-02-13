import { Bounds } from "../Common/Bounds"
import { Side } from "../Common/Geometry"
import { InactiveReason } from "./InteractableChecks"
import { InteractableManager } from "./InteractableManager"

export interface Links{
    [Side.Top]: {
        interactable: Interactable | undefined,
        angleScore: number,
        distanceScore: number
    },
    [Side.Left]: {
        interactable: Interactable | undefined,
        angleScore: number,
        distanceScore: number
    },
    [Side.Right]: {
        interactable: Interactable | undefined,
        angleScore: number,
        distanceScore: number
    },
    [Side.Bottom]: {
        interactable: Interactable | undefined,
        angleScore: number,
        distanceScore: number
    }
}

export class Interactable{
    public element: HTMLElement
    public bounds: Bounds
    public links: Links
    public active: boolean = false
    public inactiveReason: InactiveReason = "active"
    public interactable: boolean = false

    constructor(element: HTMLElement){
        this.element = element
        this.bounds = Bounds.fromElement(element)
        this.links = {
            [Side.Top]: {
                interactable: undefined,
                angleScore: Number.MAX_VALUE,
                distanceScore: Number.MAX_VALUE
            },
            [Side.Left]: {
                interactable: undefined,
                angleScore: Number.MAX_VALUE,
                distanceScore: Number.MAX_VALUE
            },
            [Side.Right]: {
                interactable: undefined,
                angleScore: Number.MAX_VALUE,
                distanceScore: Number.MAX_VALUE
            },
            [Side.Bottom]: {
                interactable: undefined,
                angleScore: Number.MAX_VALUE,
                distanceScore: Number.MAX_VALUE
            }
        }
    }

    public isInteractable(): boolean{
        for(let check of InteractableManager.interactableCheck){
            if(!check(this)){
                this.interactable = false
                return false
            }
        }
        this.inactiveReason = "active";
        this.interactable = true
        return true;
    }

    public isActive(): boolean{
        return this.element === InteractableManager.active?.element
    }

    public static getAll(): HTMLElement[]{
        return [...document.querySelectorAll("button,a")] as HTMLElement[]
    }
}
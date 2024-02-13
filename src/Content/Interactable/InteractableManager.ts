import { Side, angleInRange, distance, getAngleTo, sideToRange, withinRange, sideToOpposite } from "../Common/Geometry"
import { Interactable } from "./Interactable"
import { onScreenCheck, disabledCheck, sizeCheck, layerIndexCheck } from "./InteractableChecks"

export type InteractableCheck = (interactable: Interactable) => boolean

export interface ElementScoreComponents {
    target: Interactable
    interactable: Interactable
    angle: number
    distance: number
    size: number
    valid?: boolean
    angleScore: number
    distanceScore: number
    isVisible: boolean
}

export class InteractableManager {
    public static interactables: Interactable[] = []
    public static currentInteractables: Interactable[] = []
    public static interactableCheck: InteractableCheck[] = []
    public static active: Interactable | undefined

    public static addInteractable(elements: HTMLElement[]) {
        for (let element of elements) {
            if (InteractableManager.interactables.find(i => i.element === element)) continue
            InteractableManager.interactables.push(new Interactable(element))
        }
    }

    public static addCheck(check: InteractableCheck) {
        InteractableManager.interactableCheck.push(check)
    }

    public static loadChecks() {
        InteractableManager.addCheck(onScreenCheck)
        InteractableManager.addCheck(disabledCheck)
        InteractableManager.addCheck(sizeCheck)
        InteractableManager.addCheck(layerIndexCheck)
    }

    public static updateLinks() {
        for (let interactable of InteractableManager.currentInteractables) {
            let bestLinks: ElementScoreComponents[] = InteractableManager.currentInteractables.map(i => {
                return {
                    target: interactable,
                    interactable: i,
                    angle: getAngleTo(interactable.bounds.getAnchor(), i.bounds.getAnchor()),
                    distance: distance(interactable.bounds.getAnchor(), i.bounds.getAnchor()),
                    size: i.bounds.getSquareSize(),
                    angleScore: Number.MAX_VALUE,
                    distanceScore: Number.MAX_VALUE,
                    isVisible: i.inactiveReason === "active"
                }
            });
            for (let side of Object.keys(interactable.links) as Side[]) {
                let bestLink: ElementScoreComponents[] = bestLinks.sort((a, b) => {
                    let angleDeviationA = angleInRange(a.angle, sideToRange(side))
                    let angleDeviationB = angleInRange(b.angle, sideToRange(side))
                    let validAngleA = withinRange(angleDeviationA, 40, 0)
                    let validAngleB = withinRange(angleDeviationB, 40, 0)
                    a.angleScore = angleDeviationA
                    b.angleScore = angleDeviationB
                    a.distanceScore = a.distance
                    b.distanceScore = b.distance
                    if (a.interactable === interactable) {
                        return 1
                    }
                    if (b.interactable === interactable) {
                        return -1
                    }
                    if (validAngleA && validAngleB) {
                        a.valid = true
                        b.valid = true
                        return a.distance > b.distance ? 1 : -1
                    } else {
                        a.valid = validAngleA
                        b.valid = validAngleB
                        if (a.distance * 2 < b.distance) {
                            return -1;
                        } else if (b.distance * 2 < a.distance) {
                            return 1;
                        }
                        a.valid = validAngleA
                        b.valid = validAngleB
                        if (validAngleA) {
                            return -1;
                        } else if (validAngleB) {
                            return 1;
                        } else {
                            return angleDeviationA > angleDeviationB ? 1 : -1
                        }
                    }
                });
                if (bestLink.length > 0 &&
                    bestLink[0].valid) {
                    if (interactable.links[side].interactable?.inactiveReason !== "active" ||
                        bestLink[0].interactable.links[sideToOpposite(side)].interactable?.inactiveReason !== "active") {
                        interactable.links[side].interactable = undefined
                        interactable.links[side].distanceScore = -1
                        interactable.links[side].angleScore = -1
                    }
                    if (interactable.links[side].interactable === undefined &&
                        bestLink[0].interactable.links[sideToOpposite(side)].interactable === undefined) {

                        interactable.links[side].interactable = bestLink[0].interactable
                        interactable.links[side].angleScore = bestLink[0].angleScore
                        interactable.links[side].distanceScore = bestLink[0].distanceScore
                        //@ts-ignore
                        interactable.links[side].interactable.links[sideToOpposite(side)].interactable = interactable
                    }
                } else {
                    interactable.links[side].interactable = undefined
                    interactable.links[side].distanceScore = -1
                    interactable.links[side].angleScore = -1
                }
            }
        }
    }

    public static update() {
        InteractableManager.addInteractable(Interactable.getAll())
        InteractableManager.currentInteractables = [];
        for (let interactable of InteractableManager.interactables) {
            if (interactable.isInteractable()) {
                InteractableManager.currentInteractables.push(interactable)
            }
        }
        InteractableManager.updateLinks()
    }
}
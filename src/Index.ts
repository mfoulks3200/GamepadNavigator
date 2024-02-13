import { Controller, ControllerEvent } from "./Content/Controllers/Controller";
import { JoystickDirection, JoystickEvent, JoystickVector } from "./Content/Controllers/Joystick";
import { OverlayCanvas } from "./Content/Overlay/OverlayCanvas";
import { ControllerOverlay } from "./Content/Overlay/Layers/ControllerOverlay";
import { InteractableManager } from "./Content/Interactable/InteractableManager";
import { TestOverlay } from "./Content/Overlay/Layers/TestOverlay";
import { UIMapOverlay, UIMapOverlayLink } from "./Content/Overlay/Layers/UIMapOverlay";
import { Side } from "./Content/Common/Geometry";

console.log("Starting GamePad Navigator!")
Controller.startListeners()

console.log("Starting debug canvas!")
let debugCanvas = new OverlayCanvas()
let testOverlay = new TestOverlay()
let uiMapOverlay = new UIMapOverlay()
debugCanvas.addLayer(testOverlay)
debugCanvas.addLayer(uiMapOverlay)
let links: UIMapOverlayLink[] = [];
let sides = [Side.Top, Side.Left, Side.Right, Side.Bottom]
setInterval(() => {
    InteractableManager.loadChecks();
    InteractableManager.update()
    console.log("Updating interactables!", InteractableManager.interactables)
    testOverlay.interactables = InteractableManager.interactables
    let currentInteractableLength = 0;
    if(currentInteractableLength !== InteractableManager.currentInteractables.length-1){
        links = [];
        for(let i of InteractableManager.currentInteractables){
            if(i.links[Side.Top].interactable){
                links.push({
                    from: {
                        bounds: i.bounds,
                        side: Side.Top,
                        distanceScore: i.links[Side.Top].distanceScore,
                        angleScore: i.links[Side.Top].angleScore
                    },
                    to: {
                        bounds: i.links[Side.Top].interactable.bounds,
                        side: Side.Bottom,
                        distanceScore: i.links[Side.Bottom].distanceScore,
                        angleScore: i.links[Side.Bottom].angleScore
                    }
                })
            }
            if(i.links[Side.Bottom].interactable){
                links.push({
                    from: {
                        bounds: i.bounds,
                        side: Side.Bottom,
                        distanceScore: i.links[Side.Bottom].distanceScore,
                        angleScore: i.links[Side.Bottom].angleScore
                    },
                    to: {
                        bounds: i.links[Side.Bottom].interactable.bounds,
                        side: Side.Top,
                        distanceScore: i.links[Side.Top].distanceScore,
                        angleScore: i.links[Side.Top].angleScore
                    }
                })
            }
            if(i.links[Side.Left].interactable){
                links.push({
                    from: {
                        bounds: i.bounds,
                        //@ts-ignore
                        side: Side.Left,
                        distanceScore: i.links[Side.Left].distanceScore,
                        angleScore: i.links[Side.Left].angleScore
                    },
                    to: {
                        bounds: i.links[Side.Left].interactable.bounds,
                        side: Side.Right,
                        distanceScore: i.links[Side.Right].distanceScore,
                        angleScore: i.links[Side.Right].angleScore
                    }
                })
            }
            if(i.links[Side.Right].interactable){
                links.push({
                    from: {
                        bounds: i.bounds,
                        side: Side.Right,
                        distanceScore: i.links[Side.Right].distanceScore,
                        angleScore: i.links[Side.Right].angleScore
                    },
                    to: {
                        bounds: i.links[Side.Right].interactable.bounds,
                        side: Side.Left,
                        distanceScore: i.links[Side.Left].distanceScore,
                        angleScore: i.links[Side.Left].angleScore
                    }
                })
            }
        }
        currentInteractableLength = InteractableManager.currentInteractables.length;
    }
    uiMapOverlay.link = links
}, 1000)

Controller.addListener(ControllerEvent.Connected, controller => {
    controller.joysticks[0].addListener(JoystickEvent.MoveDirection, (vector: JoystickVector) => {
        console.log("Joystick Moved!", vector)
        if(vector.direction !== JoystickDirection.Neutral){
            
        }
    });
    debugCanvas.addLayer(new ControllerOverlay(controller))
})

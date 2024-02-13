import { Axis } from "./Axis"
import { Button } from "./Button"
import { Joystick } from "./Joystick"
import {
    ControllerProfile,
    defaultControllerProfiles
} from "./ControllerProfiles"

export enum ControllerEvent {
    Connected,
    Disconnected
}

export interface ControllerListener {
    callback: (controller: Controller) => void
    event: ControllerEvent
}

export class Controller {
    public index: number = 0
    public name: string = ""
    public buttons: Button[] = []
    public axes: Axis[] = []
    public joysticks: Joystick[] = []
    public profile: ControllerProfile | undefined

    public static controllers: Controller[] = []
    public static pollingInterval: number = 50
    private static listenersStarted: boolean = false
    private static listeners: ControllerListener[] = []

    constructor(
        index: number,
        name: string,
        buttons: boolean[],
        axes: number[]
    ) {
        this.index = index
        this.name = name
        this.profile = defaultControllerProfiles.find(profile =>
            profile.matchesProfile(name)
        )
        for (let i = 0; i < buttons.length; i++) {
            this.buttons.push(new Button(i, this))
        }
        for (let i = 0; i < axes.length; i++) {
            this.axes.push(new Axis(`${i}`, this))
        }
        for (let i = 0; i < axes.length / 2; i++) {
            this.joysticks.push(
                new Joystick(
                    `Joystick ${i}`,
                    this.axes[i * 2],
                    this.axes[i * 2 + 1],
                    this
                )
            )
        }
    }

    public updateController(buttons: boolean[], axes: number[]) {
        for (let i = 0; i < buttons.length; i++) {
            this.buttons[i].updateCurrentState(buttons[i])
        }
        for (let i = 0; i < axes.length; i++) {
            this.axes[i].updateCurrentState(axes[i])
        }
    }

    public static startListeners() {
        if (Controller.listenersStarted) {
            return
        }
        window.addEventListener("gamepadconnected", e => {
            console.log(
                "Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index,
                e.gamepad.id,
                e.gamepad.buttons.length,
                e.gamepad.axes.length
            )
            setInterval(() => {
                Controller.updateAllControllers()
            }, Controller.pollingInterval)
        })

        window.addEventListener("gamepaddisconnected", e => {
            let disconnectedController = Controller.controllers.find(
                controller => controller.index === e.gamepad.index
            )
            Controller.listeners
                .filter(
                    listener => listener.event === ControllerEvent.Disconnected
                )
                .forEach(listener =>
                    listener.callback(disconnectedController as Controller)
                )
            Controller.controllers = Controller.controllers.filter(
                controller => controller.index !== e.gamepad.index
            )
        })
        Controller.listenersStarted = true
    }

    public static updateAllControllers() {
        const gamepads = navigator.getGamepads()
        if (gamepads.length > 0) {
            for (let gamepad of gamepads) {
                let existingGamepad = this.controllers.find(
                    controller => controller.index === gamepad?.index
                )
                if (gamepad) {
                    if (existingGamepad) {
                        existingGamepad.updateController(
                            gamepad.buttons.map(button => button.value > 0.5),
                            gamepad.axes.map(axis => axis.valueOf())
                        )
                    } else {
                        let newController = new Controller(
                            gamepad.index,
                            gamepad.id,
                            gamepad.buttons.map(button => button.value > 0.5),
                            gamepad.axes.map(axis => axis.valueOf())
                        )
                        Controller.controllers.push(newController)
                        Controller.listeners
                            .filter(
                                listener =>
                                    listener.event === ControllerEvent.Connected
                            )
                            .forEach(listener =>
                                listener.callback(newController)
                            )
                    }
                }
            }
        }
    }

    public static addListener(
        event: ControllerEvent,
        listener: (controller: Controller) => void
    ) {
        Controller.listeners.push({
            callback: listener,
            event: event
        })
    }
}

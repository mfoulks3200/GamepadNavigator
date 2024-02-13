import { Controller } from "./Controller"
import { ControllerButtonProfile } from "./ControllerProfiles"

export enum ButtonEvent {
    ButtonDown,
    ButtonUp,
    ButtonHeld
}

export interface ButtonListener {
    callback: () => void
    event: ButtonEvent
}

export class Button {
    public pressed: boolean = false
    public index: number = 0
    public parent: Controller

    private listeners: ButtonListener[] = []

    constructor(buttonIndex: number, parent: Controller) {
        this.index = buttonIndex
        this.parent = parent
    }

    public getName(): string {
        if (this.parent.profile) {
            return (
                this.parent.profile.buttons.find(
                    profileButton => profileButton.id === this.index
                )?.label || this.index.toString()
            )
        } else {
            return this.index.toString()
        }
    }

    public getProfileButton(): ControllerButtonProfile | undefined {
        return this.parent.profile?.buttons.find(
            profileButton => profileButton.id === this.index
        )
    }

    public updateCurrentState(pressed: boolean) {
        if (pressed && !this.pressed) {
            this.listeners
                .filter(listener => listener.event === ButtonEvent.ButtonDown)
                .forEach(listener => listener.callback())
        }
        if (!pressed && this.pressed) {
            this.listeners
                .filter(listener => listener.event === ButtonEvent.ButtonUp)
                .forEach(listener => listener.callback())
        }
        this.listeners
            .filter(listener => listener.event === ButtonEvent.ButtonHeld)
            .forEach(listener => listener.callback())
        this.pressed = pressed
    }

    public addListener(event: ButtonEvent, listener: () => void) {
        this.listeners.push({
            callback: listener,
            event: event
        })
    }
}

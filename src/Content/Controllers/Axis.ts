import { Controller } from "./Controller"

export enum AxisEvent {
    MovePositive,
    MoveNegative,
    MovePositiveHeld,
    MoveNegativeHeld,
    MoveNeutral
}

export interface AxisListener {
    callback: (value: number) => void
    event: AxisEvent
}

export class Axis {
    public value: number = 0
    public isNeutral: boolean = true
    public label: string = ""
    public parent: Controller

    private listeners: AxisListener[] = []

    public static deadzone: number = 0.1

    constructor(label: string, parent: Controller) {
        this.label = label
        this.parent = parent
    }

    public updateCurrentState(value: number) {
        let currentValue = this.value
        this.value = value
        if (currentValue >= Axis.deadzone) {
            if (this.isNeutral) {
                this.isNeutral = false
                this.listeners
                    .filter(
                        listener => listener.event === AxisEvent.MovePositive
                    )
                    .forEach(listener => listener.callback(value))
            }
            this.listeners
                .filter(
                    listener => listener.event === AxisEvent.MovePositiveHeld
                )
                .forEach(listener => listener.callback(value))
        }
        if (currentValue <= -Axis.deadzone) {
            if (this.isNeutral) {
                this.isNeutral = false
                this.listeners
                    .filter(
                        listener => listener.event === AxisEvent.MoveNegative
                    )
                    .forEach(listener => listener.callback(value))
            }
            this.listeners
                .filter(
                    listener => listener.event === AxisEvent.MoveNegativeHeld
                )
                .forEach(listener => listener.callback(value))
        }
        if (
            currentValue > -Axis.deadzone &&
            currentValue < Axis.deadzone &&
            !this.isNeutral
        ) {
            this.isNeutral = true
            this.listeners
                .filter(listener => listener.event === AxisEvent.MoveNeutral)
                .forEach(listener => listener.callback(value))
        }
    }

    public addListener(event: AxisEvent, listener: () => void) {
        this.listeners.push({
            callback: listener,
            event: event
        })
    }
}

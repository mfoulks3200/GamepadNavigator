import { Axis, AxisEvent } from "./Axis"
import { Controller } from "./Controller"

export enum JoystickEvent {
    MoveDirection,
    MoveDirectionHeld,
    MoveNeutral
}

export enum JoystickDirection {
    Up,
    Right,
    Down,
    Left,
    Neutral
}

export interface JoystickVector {
    x: number
    y: number
    distance: number
    angle: number
    direction: JoystickDirection
}

export interface JoystickListener {
    callback: (vector: JoystickVector) => void
    event: JoystickEvent
}

export class Joystick {
    public xAxis: Axis
    public yAxis: Axis
    public vector: JoystickVector = {
        x: 0,
        y: 0,
        distance: 0,
        angle: 0,
        direction: JoystickDirection.Neutral
    }
    public label: string = ""
    public parent: Controller

    private listeners: JoystickListener[] = []

    public static deadzone: number = 0.25

    constructor(label: string, xAxis: Axis, yAxis: Axis, parent: Controller) {
        this.label = label
        this.parent = parent
        this.xAxis = xAxis
        this.yAxis = yAxis

        xAxis.addListener(AxisEvent.MovePositiveHeld, () =>
            this.updateCurrentState()
        )
        xAxis.addListener(AxisEvent.MoveNegativeHeld, () => 
            this.updateCurrentState()
        )
        xAxis.addListener(AxisEvent.MoveNeutral, () => 
            this.updateCurrentState()
        )

        yAxis.addListener(AxisEvent.MovePositiveHeld, () =>
            this.updateCurrentState()
        )
        yAxis.addListener(AxisEvent.MoveNegativeHeld, () =>
            this.updateCurrentState()
        )
        yAxis.addListener(AxisEvent.MoveNeutral, () => 
            this.updateCurrentState()
        )
    }

    public updateCurrentState() {
        let newVector = Joystick.axesToVector(this.xAxis, this.yAxis)
        if (
            newVector.distance >= Joystick.deadzone &&
            newVector.direction !== this.vector.direction &&
            newVector.direction !== JoystickDirection.Neutral
        ) {
            this.listeners
                .filter(
                    listener => listener.event === JoystickEvent.MoveDirection
                )
                .forEach(listener => listener.callback(newVector))
        }else if (newVector.distance >= Joystick.deadzone) {
            this.listeners
                .filter(
                    listener =>
                        listener.event === JoystickEvent.MoveDirectionHeld
                )
                .forEach(listener => listener.callback(newVector))
        }else if (
            this.vector.distance < Joystick.deadzone &&
            newVector.direction !== JoystickDirection.Neutral
        ) {
            this.vector.direction = JoystickDirection.Neutral
            this.vector.distance = 0
            this.vector.x = 0
            this.vector.y = 0
            this.listeners
                .filter(
                    listener => listener.event === JoystickEvent.MoveNeutral
                )
                .forEach(listener => listener.callback(newVector))
        }
        this.vector = newVector
    }

    public static axesToVector(xAxis: Axis, yAxis: Axis): JoystickVector {
        let x = xAxis.value
        let y = yAxis.value
        let distance = Math.sqrt(Math.abs(x * x) + Math.abs(y * y))
        let angle = ((Math.atan2(y, x) * (180 / Math.PI)) + 450) % 360
        let direction = Joystick.angleToDirection(angle)
        return {
            x: x,
            y: y,
            distance: distance,
            angle: angle,
            direction: direction
        }
    }

    public static angleToDirection(angle: number): JoystickDirection {
        let direction = JoystickDirection.Left
        if (angle >= (90-45) && angle <= (90+45)) {
            direction = JoystickDirection.Right
        }else if ((angle >= 0 && angle <= 45) || (angle >= (360-45) && angle <= 360)) {
            direction = JoystickDirection.Up
        }else if (angle <= (180+45) && angle >= (180-45)) {
            direction = JoystickDirection.Down
        }
        return direction
    }

    public addListener(event: JoystickEvent, listener: (vector: JoystickVector) => void) {
        this.listeners.push({
            callback: listener,
            event: event
        })
    }
}

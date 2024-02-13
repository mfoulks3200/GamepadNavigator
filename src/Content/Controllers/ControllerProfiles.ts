import { Controller } from "./Controller"

export enum ControllerButtons {
    A,
    B,
    X,
    Y,
    LeftBumper,
    RightBumper,
    LeftTrigger,
    RightTrigger,
    Back,
    Start,
    LeftStick,
    RightStick,
    DPadUp,
    DPadDown,
    DPadLeft,
    DPadRight
}

export enum ControllerButtonType {
    Button,
    MenuButton,
    Joystick,
    LeftBumper,
    RightBumper,
    LeftTrigger,
    RightTrigger,
    DPadUp,
    DPadDown,
    DPadLeft,
    DPadRight
}

export interface ControllerButtonProfile {
    button: ControllerButtons
    type: ControllerButtonType
    label: string
    color?: string
    id: number
}

export interface ControllerProfile {
    name: string
    manufacturer: string
    matchesProfile: (name: string) => boolean
    buttons: ControllerButtonProfile[]
}

export const defaultControllerProfiles: ControllerProfile[] = [
    {
        name: "Xbox 360 Controller",
        manufacturer: "Microsoft",
        matchesProfile: (name: string) => name.toLowerCase().includes("xbox"),
        buttons: [
            {
                button: ControllerButtons.A,
                type: ControllerButtonType.Button,
                color: "green",
                label: "A",
                id: 0
            },
            {
                button: ControllerButtons.B,
                type: ControllerButtonType.Button,
                color: "red",
                label: "B",
                id: 1
            },
            {
                button: ControllerButtons.X,
                type: ControllerButtonType.Button,
                color: "blue",
                label: "X",
                id: 2
            },
            {
                button: ControllerButtons.Y,
                type: ControllerButtonType.Button,
                color: "yellow",
                label: "Y",
                id: 3
            },
            {
                button: ControllerButtons.DPadUp,
                type: ControllerButtonType.DPadUp,
                label: "⭡",
                id: 12
            },
            {
                button: ControllerButtons.DPadDown,
                type: ControllerButtonType.DPadDown,
                label: "⭣",
                id: 13
            },
            {
                button: ControllerButtons.DPadLeft,
                type: ControllerButtonType.DPadLeft,
                label: "⭠",
                id: 14
            },
            {
                button: ControllerButtons.DPadRight,
                type: ControllerButtonType.DPadRight,
                label: "⭢",
                id: 15
            },
            {
                button: ControllerButtons.LeftStick,
                type: ControllerButtonType.Joystick,
                label: "Ⓛ",
                id: 10
            },
            {
                button: ControllerButtons.RightStick,
                type: ControllerButtonType.Joystick,
                label: "Ⓡ",
                id: 11
            },
            {
                button: ControllerButtons.LeftBumper,
                type: ControllerButtonType.LeftBumper,
                label: "L1",
                id: 4
            },
            {
                button: ControllerButtons.RightBumper,
                type: ControllerButtonType.RightBumper,
                label: "R1",
                id: 5
            },
            {
                button: ControllerButtons.LeftTrigger,
                type: ControllerButtonType.LeftTrigger,
                label: "L2",
                id: 6
            },
            {
                button: ControllerButtons.RightTrigger,
                type: ControllerButtonType.RightTrigger,
                label: "R2",
                id: 7
            },
            {
                button: ControllerButtons.Back,
                type: ControllerButtonType.MenuButton,
                label: "⧉",
                id: 8
            },
            {
                button: ControllerButtons.Start,
                type: ControllerButtonType.MenuButton,
                label: "𝄘",
                id: 9
            }
        ]
    }
]

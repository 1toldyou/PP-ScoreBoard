import type {Cone} from "./cone";

// the number behind the enum represent points for each cone on the junction
export enum PoleHeight {
    TERMINAL = 1,
    GROUND = 2,
    LOW = 3,
    MEDIUM = 4,
    HIGH = 5,
}

export interface Pole {
    height: PoleHeight;
    xCoordinate: number;
    yCoordinate: number;
    cones: Cone[];
    blueConeCount: number;
    redConeCount: number;
}

export function getPoleCSS(pole: Pole): string {
    const list: string[] = ["terminal", "junction"];
    switch (pole.height) {
        case PoleHeight.GROUND:
            list.push("ground");
            break;
        case PoleHeight.LOW:
            list.push("low");
            break;
        case PoleHeight.MEDIUM:
            list.push("medium");
            break;
        case PoleHeight.HIGH:
            list.push("high");
            break;
    }
    return list.join(" ");
}
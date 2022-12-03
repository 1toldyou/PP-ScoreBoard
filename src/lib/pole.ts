import type {Cone} from "./cone";

export enum PoleHeight {
    GROUND,
    LOW,
    MEDIUM,
    HIGH,
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
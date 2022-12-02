import type {Cone} from "./cone";

export enum PoleHeight {
    GROUND,
    LOW,
    MEDIUM,
    HIGH,
}

export interface Pole {
    height: PoleHeight;
    coordinates: [number, number];
    cones: Cone[];
    blueConeCount: number;
    redConeCount: number;
}
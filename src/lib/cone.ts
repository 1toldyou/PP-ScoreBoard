export enum ConeType {
    REGULAR,
    AUTO,
    BEACON,
}

export enum Alliance {
    BLUE,
    RED,
}

export interface Robot {
    alliance: Alliance;
    number: number;
}

export interface Cone {
    category: ConeType;
    color: Alliance;
    robot?: Robot;
    coordinates: [number, number];
}
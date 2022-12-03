import type {Pole} from "./pole";
import {PoleHeight} from "./pole";

export const originalJunctions: Pole[][] = [
    [
        {height: PoleHeight.GROUND, xCoordinate: 0, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
        {height: PoleHeight.LOW, xCoordinate: 1, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
        {height: PoleHeight.GROUND, xCoordinate: 2, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
        {height: PoleHeight.LOW, xCoordinate: 3, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
        {height: PoleHeight.GROUND, xCoordinate: 4, yCoordinate: 0, cones: [], blueConeCount: 0, redConeCount: 0},
    ],
    [
        {height: PoleHeight.LOW, xCoordinate: 0, yCoordinate: 1, cones: [], blueConeCount: 0, redConeCount: 0},
        {height: PoleHeight.MEDIUM, xCoordinate: 1, yCoordinate: 1, cones: [], blueConeCount: 0, redConeCount: 0},
        {height: PoleHeight.HIGH, xCoordinate: 2, yCoordinate: 1, cones: [], blueConeCount: 0, redConeCount: 0},
        {height: PoleHeight.MEDIUM, xCoordinate: 3, yCoordinate: 1, cones: [], blueConeCount: 0, redConeCount: 0},
        {height: PoleHeight.LOW, xCoordinate: 4, yCoordinate: 1, cones: [], blueConeCount: 0, redConeCount: 0},
    ],
];
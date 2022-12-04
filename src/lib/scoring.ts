import type {GameAction} from "./game-action";
import {Alliance, ConeType} from "./cone";

export interface Scoring {
    blueTotal: number;
    redTotal: number;
    blueAutoCone?: number;
    redAutoCone?: number;
    blueTeleopCone?: number;
    redTeleopCone?: number;
}

export function computeScore(actions: GameAction[]): Scoring{
    let currentConeScoreMultiplier: number;
    let blueTotal = 0;
    let redTotal = 0;
    let blueAutoCone = 0;
    let redAutoCone = 0;

    actions.forEach(action => {
        if (action.cone.category === ConeType.AUTO) {
            currentConeScoreMultiplier = 2;
            if (action.cone.color == Alliance.BLUE) {
                blueAutoCone += action.pole.height * currentConeScoreMultiplier;
            }
            else if (action.cone.color == Alliance.RED) {
                redAutoCone += action.pole.height * currentConeScoreMultiplier;
            }
        } else if (action.cone.category === ConeType.REGULAR) {
            currentConeScoreMultiplier = 1;
            if (action.cone.color == Alliance.BLUE) {
                blueTotal += action.pole.height * currentConeScoreMultiplier;
            }
            else if (action.cone.color == Alliance.RED) {
                redTotal += action.pole.height * currentConeScoreMultiplier;
            }
        }
    });

    blueTotal += blueAutoCone;
    redTotal += redAutoCone;

    return {
        blueTotal: blueTotal,
        redTotal: redTotal,
        blueAutoCone: blueAutoCone,
        redAutoCone: redAutoCone,
    }
}
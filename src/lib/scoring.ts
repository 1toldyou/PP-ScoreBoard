import type {GameAction} from "./game-action";
import {Alliance, ConeType} from "./cone";

export interface Scoring {
    blueTotal: number;
    redTotal: number;
    blueAutoConeScore?: number;
    redAutoConeScore?: number;
    blueTeleopConeScore?: number;
    redTeleopConeScore?: number;
}

export function computeScore(actions: GameAction[]): Scoring{
    let currentConeScoreMultiplier: number;
    let blueTotal = 0;
    let redTotal = 0;
    let blueAutoConeScore = 0;
    let redAutoConeScore = 0;
    let blueTeleopConeScore = 0;
    let redTeleopConeScore = 0;

    actions.forEach(action => {
        if (action.cone.category === ConeType.AUTO) {
            currentConeScoreMultiplier = 2;
            if (action.cone.color == Alliance.BLUE) {
                blueAutoConeScore += action.pole.height * currentConeScoreMultiplier;
            }
            else if (action.cone.color == Alliance.RED) {
                redAutoConeScore += action.pole.height * currentConeScoreMultiplier;
            }
        } else if (action.cone.category === ConeType.REGULAR) {
            currentConeScoreMultiplier = 1;
            if (action.cone.color == Alliance.BLUE) {
                blueTeleopConeScore += action.pole.height * currentConeScoreMultiplier;
            }
            else if (action.cone.color == Alliance.RED) {
                redTeleopConeScore += action.pole.height * currentConeScoreMultiplier;
            }
        }
    });

    blueTotal += blueAutoConeScore;
    redTotal += redAutoConeScore;
    blueTotal += blueTeleopConeScore;
    redTotal += redTeleopConeScore;

    return {
        blueTotal: blueTotal,
        redTotal: redTotal,
        blueAutoConeScore: blueAutoConeScore,
        redAutoConeScore: redAutoConeScore,
        blueTeleopConeScore: blueTeleopConeScore,
        redTeleopConeScore: redTeleopConeScore,
    }
}
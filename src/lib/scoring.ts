import type {GameAction} from "./game-action";
import {Alliance, ConeType} from "./cone";

export interface Scoring {
    blueTotal: number;
    redTotal: number;
}

export function computeScore(actions: GameAction[]): Scoring{
    let blueTotal = 0;
    let redTotal = 0;

    actions.forEach(action => {
        const currentConeScoreMultiplier = action.cone.category === ConeType.AUTO ? 2 : 1;
        if (action.cone.color == Alliance.BLUE) {
            blueTotal += action.pole.height * currentConeScoreMultiplier;
        }
        else if (action.cone.color == Alliance.RED) {
            redTotal += action.pole.height * currentConeScoreMultiplier;
        }
    });

    return {
        blueTotal: blueTotal,
        redTotal: redTotal,
    }
}
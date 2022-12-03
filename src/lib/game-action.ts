import type {Cone} from "./cone";
import type {Pole} from "./pole";

export interface GameAction {
    cone: Cone;
    pole: Pole;
}

export enum GameStage {
    PRE_GAME = 0,
    AUTO = 10,
    TELEOP = 20,
}
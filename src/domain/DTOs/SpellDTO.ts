import { UUID } from "crypto";
import { ActionType, DamageType } from "../../common/resolvers-types.js";

export interface SpellDTO {
  id: UUID;
  name: string;
  effect: string;
  type: ActionType;
  damageType: DamageType;
}

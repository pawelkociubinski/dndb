import { UUID } from "crypto";
import { ActionType, DamageType } from "../../common/resolvers-types.js";

export interface EquipmentDTO {
  id: UUID;
  name: string;
  effect: string;
  type: ActionType;
  damageType: DamageType;
}

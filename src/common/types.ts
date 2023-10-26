import { UUID } from "crypto";
import { ActionType, DamageType } from "./resolvers-types.js";

export type Whatever = any;

export interface EquipmentBlueprint {
  id: UUID;
  name: string;
  effect: string;
  type: ActionType;
  damage_type: DamageType;
}

export interface SpellBlueprint {
  id: UUID;
  name: string;
  effect: string;
  type: ActionType;
  damage_type: DamageType;
}

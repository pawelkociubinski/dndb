import { UUID } from "crypto";
import { DamageType, Defense } from "../../common/resolvers-types.js";

export interface CharacterDTO {
  id: UUID;
  name: string;
  level: number;
  maxHitPoints: number;
  currentHitPoints: number;
  temporaryHitPoints: number;
  classes: {
    name: string;
    hitDiceValue: number;
    classLevel: number;
  }[];
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  items: {
    id: UUID;
    name: string;
    modifier: {
      affectedObject: string;
      affectedValue: string;
      value: number;
    };
  }[];
  defenses: {
    type: DamageType;
    defense: Defense;
  }[];
}

import { UUID } from "crypto";
import { DamageType, Defense } from "./resolvers-types.js";

export interface BasicCharacter {
  id: UUID;
  name: string;
  level: number;
  max_hitpoints: number;
  current_hitpoints: number;
  temporary_hitpoints: number;
}

export interface CharacterStats {
  character_id: UUID;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Class {
  name: string;
  hit_dice_value: number;
}

export interface CharacterClass {
  character_id: string;
  class_name: number;
  class_level: number;
}

export interface Item {
  id: UUID;
  name: string;
}

export interface CharacterItem {
  character_id: UUID;
  item_id: UUID;
}

export interface ItemModifier {
  item_id: UUID;
  affected_object: string;
  affected_value: string;
  value: number;
}

export interface Resistance {
  type: DamageType;
  defense: Defense;
}

export interface CharacterResistance {
  character_id: string;
  resistance_type: DamageType;
  resistance_defense: Defense;
}

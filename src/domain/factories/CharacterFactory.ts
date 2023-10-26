import { UUID } from "crypto";
import {
  BasicCharacter,
  CharacterClass,
  CharacterStats,
  Class,
  Item,
  ItemModifier,
} from "../../common/knex-types.js";
import { DamageType, Defense } from "../../common/resolvers-types.js";
import { Character } from "../aggregates/Character.js";
import { DomainEvent } from "../events/index.js";

export interface DetailedCharacter {
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
  defenses: { type: DamageType; defense: Defense }[];
}

interface IDependancies {
  eventStore: DomainEvent;
}

export class CharacterFactory {
  constructor(private dependancies: IDependancies) {}

  create(detailedCharacter: DetailedCharacter): Character {
    const { eventStore } = this.dependancies;

    return Character.create(detailedCharacter, eventStore);
  }
}

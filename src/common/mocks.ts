import { UUID } from "crypto";
import { DomainEvent } from "../domain/events/index.js";
import { DetailedCharacter } from "../domain/factories/CharacterFactory.js";
import { Character } from "../domain/aggregates/Character.js";
import { ActionType, DamageType } from "./resolvers-types.js";
import { Spell } from "../domain/aggregates/Spell.js";
import { SpellBlueprint } from "../domain/factories/SpellFactory.js";
import { rollDice } from "./Dice.js";
import { Equipment } from "../domain/aggregates/Equipment.js";
import { EquipmentBlueprint } from "./types.js";
import { ICharacterRepositoryPort } from "../domain/ports/ICharacterRespositoryPort.js";
import { IEquipmentRepositoryPort } from "../domain/ports/IEquipmentRepositoryPort.js";
import { ISpellbookRepositoryPort } from "../domain/ports/ISpellbookRepositoryPort.js";
import { CharacterBlueprint } from "./characterBlueprint.js";

jest.mock("./Dice.js");
export const rollDiceMocked = jest.mocked(rollDice);

const character = {
  id: `1234-1234-1234-1234-1234` as UUID,
  name: "John Doe",
  level: 1,
  maxHitPoints: 10,
  currentHitPoints: 10,
  temporaryHitPoints: 0,
  classes: [],
  stats: {
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
  },
  items: [],
  defenses: [],
} satisfies DetailedCharacter;

export const characterBlueprint = {
  name: "Briv",
  level: 5,
  hitPoints: 25,
  classes: [
    {
      name: "fighter",
      hitDiceValue: 10,
      classLevel: 5,
    },
  ],
  stats: {
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 13,
    wisdom: 10,
    charisma: 8,
  },
  items: [
    {
      name: "Ioun Stone of Fortitude",
      modifier: {
        affectedObject: "stats",
        affectedValue: "constitution",
        value: 2,
      },
    },
  ],
  defenses: [
    {
      type: "fire",
      defense: "immunity",
    },
    {
      type: "slashing",
      defense: "resistance",
    },
  ],
} as CharacterBlueprint;

export function createCharacter(
  domainEvent: DomainEvent,
  config?: {
    maxHitPoints?: number;
    currentHitPoints?: number;
    temporaryHitPoints?: number;
    defenses?: DetailedCharacter["defenses"];
  }
) {
  return Character.create({ ...character, ...config }, domainEvent);
}

export function attackCharacter(
  domainEvent: DomainEvent,
  config?: { effect?: number; damageType?: DamageType }
) {
  const defaultConfig = { effect: 5, damageType: DamageType.Bludgeoning };
  const finalConfing = { ...defaultConfig, ...config };

  domainEvent.emit({
    aggregateId: `1234-1234-1234-1234-1234` as UUID,
    type: "WEAPON_INFLICTED_DAMAGE",
    payload: {
      sourceName: "Stick of Destiny",
      targetName: character.name,
      type: ActionType.Damage,
      effect: finalConfing.effect,
      damageType: finalConfing.damageType,
    },
  });
}

export function healCharacter(
  domainEvent: DomainEvent,
  config?: { effect?: number }
) {
  const defaultConfig = { effect: 5 };
  const finalConfing = { ...defaultConfig, ...config };

  domainEvent.emit({
    aggregateId: `1234-1234-1234-1234-1234` as UUID,
    type: "SPELL_CASTED",
    payload: {
      sourceName: "Healing Word",
      targetName: character.name,
      type: ActionType.Healing,
      effect: finalConfing.effect,
      damageType: DamageType.None,
    },
  });
}

const spell = {
  id: `1234-1234-1234-1234-1234` as UUID,
  name: "Healing Word",
  effect: "1d6+3",
  type: ActionType.Healing,
  damageType: DamageType.None,
} satisfies SpellBlueprint;

export function createSpell(
  domainEvent: DomainEvent,
  config?: { rollDice: number }
) {
  const defaultConfig = { rollDice: 5, ...spell, ...config };
  rollDiceMocked.mockReturnValue(defaultConfig.rollDice);

  return Spell.create(defaultConfig, domainEvent);
}

export function createEquipment(domainEvent: DomainEvent) {
  const defaultConfig = {
    id: `1234-1234-1234-1234-1234` as UUID,
    name: "Ioun Stone of Fortitude",
    effect: "1d6+3",
    type: ActionType.Damage,
    damage_type: DamageType.Slashing,
  } satisfies EquipmentBlueprint;
  rollDiceMocked.mockReturnValue(5);
  return Equipment.create(defaultConfig, domainEvent);
}

export class CharacterRepositoryMock implements ICharacterRepositoryPort {
  save = jest.fn();
  findAll = jest.fn();
  findById = jest.fn();
  findByName = jest.fn();
  createByBlueprint = jest.fn();
}
export class EquipmentRepositoryMock implements IEquipmentRepositoryPort {
  findByName = jest.fn();
  findAll = jest.fn();
}
export class SpellbookRepositoryMock implements ISpellbookRepositoryPort {
  findSpellAll = jest.fn();
  findByName = jest.fn();
}

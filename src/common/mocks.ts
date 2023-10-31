import { UUID } from "crypto";
import {
  CastSpellEvent,
  DamageEvent,
  DomainEvent,
} from "../domain/events/index.js";
import { DetailedCharacter } from "../domain/factories/CharacterFactory.js";
import { Character } from "../domain/aggregates/Character.js";
import { ActionType, DamageType } from "./resolvers-types.js";
import { InMemorEventStoreAdapter } from "../infrastructure/adapters/InMemoryEventStoreAdapter.js";
import { Spell } from "../domain/aggregates/Spell.js";
import { SpellBlueprint } from "../domain/factories/SpellFactory.js";
import { rollDice } from "./Dice.js";

jest.mock("./Dice.js");
jest.mock("../infrastructure/adapters/InMemoryEventStoreAdapter.js");
export const rollDiceMocked = jest.mocked(rollDice);
export const eventStoreMocked = jest.mocked(new InMemorEventStoreAdapter());

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

export function createCharacter(config?: {
  maxHitPoints?: number;
  currentHitPoints?: number;
  temporaryHitPoints?: number;
  defenses?: DetailedCharacter["defenses"];
}) {
  return Character.create({ ...character, ...config }, eventStoreMocked);
}

export function attackCharacter(
  target: Character,
  config?: { effect?: number }
) {
  const defaultConfig = { effect: 5 };
  const finalConfing = { ...defaultConfig, ...config };

  target.applyEvent(
    new DamageEvent({
      weaponName: "axe",
      targetName: character.name,
      effect: finalConfing.effect,
      damageType: DamageType.Slashing,
    })
  );
}

export function healCharacter(target: Character, config?: { effect?: number }) {
  const defaultConfig = { effect: 5 };
  const finalConfing = { ...defaultConfig, ...config };

  target.applyEvent(
    new CastSpellEvent({
      spellName: "Healing Word",
      targetName: character.name,
      type: ActionType.Healing,
      effect: finalConfing.effect,
      damageType: DamageType.None,
    })
  );
}

const spell = {
  id: `1234-1234-1234-1234-1234` as UUID,
  name: "Healing Word",
  effect: "1d6+3",
  type: ActionType.Healing,
  damageType: DamageType.None,
} satisfies SpellBlueprint;

export function createSpell(config?: { rollDice: number }) {
  const defaultConfig = { rollDice: 5, ...spell, ...config };
  rollDiceMocked.mockReturnValue(defaultConfig.rollDice);

  return Spell.create(defaultConfig, eventStoreMocked);
}

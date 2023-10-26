import { UUID } from "crypto";
import { v4 as uuidv4 } from "uuid";
import {
  CastSpellEvent,
  DamageEvent,
  DomainEvent,
} from "../domain/events/index.js";
import { DetailedCharacter } from "../domain/factories/CharacterFactory.js";
import { Character } from "../domain/aggregates/Character.js";
import { ActionType, DamageType } from "./resolvers-types.js";
import { InMemorEventStoreAdapter } from "../infrastructure/adapters/InMemoryEventStoreAdapter.js";

export const eventStore = jest.mocked(new InMemorEventStoreAdapter());

const character = {
  id: uuidv4() as UUID,
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
}) {
  return Character.create({ ...character, ...config }, eventStore);
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
      damageType: DamageType.Force,
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

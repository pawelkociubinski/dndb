import { createSpell } from "../../common/mocks";
import { ActionType, DamageType } from "../../common/resolvers-types";
import { InMemorEventStoreAdapter } from "../../infrastructure/adapters/InMemoryEventStoreAdapter";
import { DomainEvent } from "../events";
import { Spell } from "./Spell";

let spell: Spell;
let domainEvent: DomainEvent;
let emitSpy: jest.SpyInstance;

describe("Spell", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    domainEvent = new InMemorEventStoreAdapter();
    spell = createSpell(domainEvent);
    emitSpy = jest.spyOn(domainEvent, "emit");
  });

  it("should be able to create a Spell instance", () => {
    expect(spell.id).toEqual("1234-1234-1234-1234-1234");
  });

  it("should emit an event when a spell is cast", () => {
    // when
    spell.castOn("Goblin");

    // then
    expect(emitSpy).toHaveBeenCalledWith({
      aggregateId: "1234-1234-1234-1234-1234",
      payload: {
        damageType: "NONE",
        effect: 5,
        sourceName: "Healing Word",
        targetName: "Goblin",
        type: "HEALING",
      },
      type: "SPELL_CASTED",
    });
  });

  it("should return a DTO representation of the spell", () => {
    // when
    const spellDTO = spell.toDTO();

    // then
    expect(spellDTO).toEqual({
      id: "1234-1234-1234-1234-1234",
      name: "Healing Word",
      effect: "1d6+3",
      type: ActionType.Healing,
      damageType: DamageType.None,
    });
  });
});

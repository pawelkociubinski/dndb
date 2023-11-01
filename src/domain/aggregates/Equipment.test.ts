import { createEquipment } from "../../common/mocks";
import { ActionType, DamageType } from "../../common/resolvers-types";
import { InMemorEventStoreAdapter } from "../../infrastructure/adapters/InMemoryEventStoreAdapter";
import { DomainEvent } from "../events";
import { Equipment } from "./Equipment";

let equipment: Equipment;
let domainEvent: DomainEvent;
let emitSpy: jest.SpyInstance;

describe("Spell", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    domainEvent = new InMemorEventStoreAdapter();
    equipment = createEquipment(domainEvent);
    emitSpy = jest.spyOn(domainEvent, "emit");
  });

  it("should be able to create a Spell instance", () => {
    expect(equipment.id).toEqual("1234-1234-1234-1234-1234");
  });

  it("should emit an event when a dealing a damage", () => {
    // when
    equipment.dealDamageTo("Goblin");

    // then
    expect(emitSpy).toHaveBeenCalledWith({
      aggregateId: "1234-1234-1234-1234-1234",
      payload: {
        damageType: "SLASHING",
        effect: 5,
        sourceName: "Ioun Stone of Fortitude",
        targetName: "Goblin",
        type: "DAMAGE",
      },
      type: "WEAPON_INFLICTED_DAMAGE",
    });
  });

  it("should return a DTO representation", () => {
    // when
    const equipmentDTO = equipment.toDTO();

    // then
    expect(equipmentDTO).toEqual({
      id: "1234-1234-1234-1234-1234",
      name: "Ioun Stone of Fortitude",
      effect: "1d6+3",
      type: ActionType.Damage,
      damageType: DamageType.Slashing,
    });
  });
});

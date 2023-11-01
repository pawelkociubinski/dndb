import { Character } from "./Character";
import {
  createCharacter,
  attackCharacter,
  healCharacter,
} from "../../common/mocks";
import { DamageType, Defense } from "../../common/resolvers-types";
import { InMemorEventStoreAdapter } from "../../infrastructure/adapters/InMemoryEventStoreAdapter";
import { DomainEvent } from "../events";

let character: Character;
let domainEvent: DomainEvent;
let emitSpy: jest.SpyInstance;

describe("Character", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    domainEvent = new InMemorEventStoreAdapter();
    character = createCharacter(domainEvent);
    emitSpy = jest.spyOn(domainEvent, "emit");
  });

  it("should initialize a character with correct values", () => {
    expect(character.name).toBe("John Doe");
    expect(character.isAlive).toBe(true);
  });

  describe("Healing", () => {
    it("should heal character correctly", () => {
      // given
      const character = createCharacter(domainEvent, { currentHitPoints: 2 });

      // when
      healCharacter(domainEvent, { effect: 2 });

      // then:
      const characterDTO = character.toDTO();
      expect(characterDTO.currentHitPoints).toBe(4);
      expect(characterDTO.temporaryHitPoints).toBe(0);
      expect(characterDTO.maxHitPoints).toBe(10);
    });

    it("should not heal beyond maximum hitpoint value", () => {
      // given
      const character = createCharacter(domainEvent, { currentHitPoints: 9 });

      // when
      healCharacter(domainEvent);

      // then
      const characterDTO = character.toDTO();
      expect(characterDTO.currentHitPoints).toBe(10);
      expect(characterDTO.temporaryHitPoints).toBe(0);
      expect(characterDTO.maxHitPoints).toBe(10);
    });

    it("should have no effect on the dead character", () => {
      // given
      const character = createCharacter(domainEvent, { currentHitPoints: 0 });

      // when
      healCharacter(domainEvent);

      // then:
      const characterDTO = character.toDTO();
      expect(characterDTO.currentHitPoints).toBe(0);
      expect(characterDTO.temporaryHitPoints).toBe(0);
      expect(characterDTO.maxHitPoints).toBe(10);
    });
  });

  describe("Receiving damage", () => {
    it("should receive damage correctly", () => {
      // when
      attackCharacter(domainEvent);

      // then
      expect(character.toDTO().currentHitPoints).toBe(5);
      expect(emitSpy).toHaveBeenCalledWith({
        aggregateId: "1234-1234-1234-1234-1234",
        type: "WEAPON_INFLICTED_DAMAGE",
        payload: {
          damageType: "BLUDGEONING",
          effect: 5,
          sourceName: "Stick of Destiny",
          targetName: "John Doe",
          type: "DAMAGE",
        },
      });
    });

    it("should have no effect on the dead character", () => {
      // given
      const character = createCharacter(domainEvent, { currentHitPoints: 0 });

      // when
      attackCharacter(domainEvent);

      // then
      expect(character.toDTO().currentHitPoints).toBe(0);
    });

    it("should hitpoints not fall below zero", () => {
      // when
      attackCharacter(domainEvent, { effect: 11 });

      //then
      expect(character.toDTO().currentHitPoints).toBe(0);
    });

    it("should take temporary hitpoints after hit", () => {
      // given
      const character = createCharacter(domainEvent, { temporaryHitPoints: 5 });

      // when
      attackCharacter(domainEvent);

      //then
      expect(character.toDTO().currentHitPoints).toBe(10);
      expect(character.toDTO().temporaryHitPoints).toBe(0);
      expect(character.toDTO().maxHitPoints).toBe(10);
    });

    it("should receive reduced damage by resistance", () => {
      // given
      const character = createCharacter(domainEvent, {
        defenses: [{ type: DamageType.Slashing, defense: Defense.Resistance }],
      });

      // when
      attackCharacter(domainEvent, { damageType: DamageType.Slashing });

      //then
      expect(character.toDTO().currentHitPoints).toBe(7.5);
    });

    it("should receive no damage when immune", () => {
      // given
      const character = createCharacter(domainEvent, {
        defenses: [{ type: DamageType.Slashing, defense: Defense.Immunity }],
      });

      // when
      attackCharacter(domainEvent, { damageType: DamageType.Slashing });

      //then
      expect(character.toDTO().currentHitPoints).toBe(10);
    });
  });
});

import { Character } from "./Character";
import {
  createCharacter,
  attackCharacter,
  healCharacter,
  eventStore,
} from "../../common/mocks";

let character: Character;

describe("Character", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(eventStore, "emit");
    character = createCharacter();
  });

  it("should initialize a character with correct values", () => {
    expect(character.name).toBe("John Doe");
    expect(character.isAlive).toBe(true);
  });

  describe("Healing", () => {
    it("should heal character correctly", () => {
      // given
      const character = createCharacter({ currentHitPoints: 2 });

      // when
      healCharacter(character, { effect: 2 });

      // then:
      const characterDTO = character.toDTO();
      expect(characterDTO.currentHitPoints).toBe(4);
      expect(characterDTO.temporaryHitPoints).toBe(0);
      expect(characterDTO.maxHitPoints).toBe(10);
      expect(eventStore.emit).toHaveBeenCalled();
    });

    it("should not heal beyond maximum hitpoint value", () => {
      // given
      const character = createCharacter({ currentHitPoints: 9 });

      // when
      healCharacter(character);

      // then
      const characterDTO = character.toDTO();
      expect(characterDTO.currentHitPoints).toBe(10);
      expect(characterDTO.temporaryHitPoints).toBe(0);
      expect(characterDTO.maxHitPoints).toBe(10);
      expect(eventStore.emit).toHaveBeenCalled();
    });

    it("should have no effect on the dead character", () => {
      // given
      const character = createCharacter({ currentHitPoints: 0 });

      // when
      healCharacter(character);

      // then:
      const characterDTO = character.toDTO();
      expect(characterDTO.currentHitPoints).toBe(0);
      expect(characterDTO.temporaryHitPoints).toBe(0);
      expect(characterDTO.maxHitPoints).toBe(10);
      expect(eventStore.emit).toHaveBeenCalled();
    });
  });

  describe("Receiving damage", () => {
    it("should receive damage correctly", () => {
      // when
      attackCharacter(character);

      // then
      expect(character.toDTO().currentHitPoints).toBe(5);
      expect(eventStore.emit).toHaveBeenCalled();
    });

    it("should have no effect on the dead character", () => {
      // given
      const character = createCharacter({ currentHitPoints: 0 });

      // when
      attackCharacter(character);

      // then
      expect(character.toDTO().currentHitPoints).toBe(0);
      expect(eventStore.emit).toHaveBeenCalled();
    });

    it("should hitpoints not fall below zero", () => {
      // when
      attackCharacter(character, { effect: 11 });

      //then
      expect(character.toDTO().currentHitPoints).toBe(0);
      expect(eventStore.emit).toHaveBeenCalled();
    });

    it("should take temporary hitpoints after hit", () => {
      // given
      const character = createCharacter({ temporaryHitPoints: 5 });

      // when
      attackCharacter(character);

      //then
      expect(character.toDTO().currentHitPoints).toBe(10);
      expect(character.toDTO().temporaryHitPoints).toBe(0);
      expect(character.toDTO().maxHitPoints).toBe(10);
      expect(eventStore.emit).toHaveBeenCalled();
    });
  });
});

import {
  CharacterRepositoryMock,
  EquipmentRepositoryMock,
  SpellbookRepositoryMock,
} from "../common/mocks.js";
import { CharacterActionsService } from "./CharacterActionsService.js";

const characterRepositoryMock = new CharacterRepositoryMock();
const equipmentRepositoryMock = new EquipmentRepositoryMock();
const spellbookRepositoryMock = new SpellbookRepositoryMock();

let service: CharacterActionsService;

describe("CharacterActionsService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    service = new CharacterActionsService({
      characterRepository: characterRepositoryMock,
      equipmentRepository: equipmentRepositoryMock,
      spellbookRepository: spellbookRepositoryMock,
    });
  });

  describe("makeAttack", () => {
    it("should make an attack using the weapon and save the character", async () => {
      // given
      const weaponMock = {
        dealDamageTo: jest.fn(),
      };
      const characterMock = { name: "Briv" };

      equipmentRepositoryMock.findByName.mockResolvedValue(weaponMock);
      characterRepositoryMock.findByName.mockResolvedValue(characterMock);

      // when
      await service.makeAttack("Sword", "Briv");

      // then
      expect(equipmentRepositoryMock.findByName).toHaveBeenCalledWith("Sword");
      expect(characterRepositoryMock.findByName).toHaveBeenCalledWith("Briv");
      expect(weaponMock.dealDamageTo).toHaveBeenCalledWith("Briv");
      expect(characterRepositoryMock.save).toHaveBeenCalledWith(characterMock);
    });
  });

  describe("castSpell", () => {
    it("should cast a spell on the target and save the character", async () => {
      // given
      const spellMock = {
        castOn: jest.fn(),
      };
      const characterMock = { name: "Briv" };

      spellbookRepositoryMock.findByName.mockResolvedValue(spellMock);
      characterRepositoryMock.findByName.mockResolvedValue(characterMock);

      // when
      await service.castSpell("Fireball", "Briv");

      // then
      expect(spellbookRepositoryMock.findByName).toHaveBeenCalledWith(
        "Fireball"
      );
      expect(characterRepositoryMock.findByName).toHaveBeenCalledWith("Briv");
      expect(spellMock.castOn).toHaveBeenCalledWith("Briv");
      expect(characterRepositoryMock.save).toHaveBeenCalledWith(characterMock);
    });
  });
});

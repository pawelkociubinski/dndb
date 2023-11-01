import { UUID } from "crypto";
import { CharacterRepositoryMock, characterBlueprint } from "../common/mocks";
import { CharacterService } from "./CharacterService";

const characterRepositoryMock = new CharacterRepositoryMock();
let service: CharacterService;

describe("CharacterService", () => {
  beforeEach(() => {
    service = new CharacterService({
      characterRepository: characterRepositoryMock,
    });
  });

  describe("findById", () => {
    it("should retrieve a character by ID and convert it to DTO", async () => {
      const characterMock = {
        toDTO: jest.fn(() => ({ id: "some-uuid", name: "John" })),
      };

      characterRepositoryMock.findById.mockResolvedValue(characterMock);

      const result = await service.findById("some-uuid" as UUID);

      expect(characterRepositoryMock.findById).toHaveBeenCalledWith(
        "some-uuid"
      );
      expect(characterMock.toDTO).toHaveBeenCalled();
      expect(result).toEqual({ id: "some-uuid", name: "John" });
    });
  });

  describe("findAll", () => {
    it("should retrieve all characters and convert each to DTO", async () => {
      const charactersMock = [
        { toDTO: jest.fn(() => ({ id: "uuid1", name: "John" })) },
        { toDTO: jest.fn(() => ({ id: "uuid2", name: "Doe" })) },
      ];

      characterRepositoryMock.findAll.mockResolvedValue(charactersMock);

      const results = await service.findAll();

      expect(characterRepositoryMock.findAll).toHaveBeenCalled();
      charactersMock.forEach((character) =>
        expect(character.toDTO).toHaveBeenCalled()
      );
      expect(results).toEqual([
        { id: "uuid1", name: "John" },
        { id: "uuid2", name: "Doe" },
      ]);
    });
  });

  describe("createFromBlueprint", () => {
    it("should create a character from the given blueprint", async () => {
      await service.createFromBlueprint(characterBlueprint);

      expect(characterRepositoryMock.createByBlueprint).toHaveBeenCalledWith(
        characterBlueprint
      );
    });
  });
});

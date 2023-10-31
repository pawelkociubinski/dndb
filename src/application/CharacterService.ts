import _ from "lodash";
import { UUID } from "crypto";
import { CharacterBlueprint } from "../common/characterBlueprint.js";
import { ICharacterRepositoryPort } from "../domain/ports/ICharacterRespositoryPort.js";

interface IDependancies {
  characterRepository: ICharacterRepositoryPort;
}

export class CharacterService {
  constructor(private dependancies: IDependancies) {}

  async findById(id: UUID) {
    const { characterRepository } = this.dependancies;

    const character = await characterRepository.findById(id);
    const characterDTO = character.toDTO();

    return characterDTO;
  }

  async findAll() {
    const { characterRepository } = this.dependancies;

    const characters = await characterRepository.findAll();
    const charactersDTOs = characters.map((character) => character.toDTO());

    return charactersDTOs;
  }

  async createFromBlueprint(characterBlueprint: CharacterBlueprint) {
    const { characterRepository } = this.dependancies;

    await characterRepository.createByBlueprint(characterBlueprint);
  }
}

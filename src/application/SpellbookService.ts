import { ISpellbookRepositoryPort } from "../domain/ports/ISpellbookRepositoryPort.js";

interface IDependancies {
  spellbookRepository: ISpellbookRepositoryPort;
}

export class SpellbookService {
  constructor(private dependancies: IDependancies) {}

  async findSpellAll() {
    const { spellbookRepository } = this.dependancies;

    const spells = await spellbookRepository.findSpellAll();
    const spellsDTOs = spells.map((spell) => spell.toDTO());

    return spellsDTOs;
  }

  async findByName(spellName: string) {
    const { spellbookRepository } = this.dependancies;

    const spell = await spellbookRepository.findByName(spellName);
    const spellDTO = spell.toDTO();

    return spellDTO;
  }
}

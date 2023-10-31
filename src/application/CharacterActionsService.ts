import { ICharacterRepositoryPort } from "../domain/ports/ICharacterRespositoryPort.js";
import { IEquipmentRepositoryPort } from "../domain/ports/IEquipmentRepositoryPort.js";
import { ISpellbookRepositoryPort } from "../domain/ports/ISpellbookRepositoryPort.js";

interface IDependancies {
  characterRepository: ICharacterRepositoryPort;
  equipmentRepository: IEquipmentRepositoryPort;
  spellbookRepository: ISpellbookRepositoryPort;
}

export class CharacterActionsService {
  constructor(private dependancies: IDependancies) {}

  async makeAttack(weaponName: string, targetName: string) {
    const { equipmentRepository, characterRepository } = this.dependancies;

    const weapon = await equipmentRepository.findByName(weaponName);
    const character = await characterRepository.findByName(targetName);

    weapon.dealDamageTo(character.name);
    await characterRepository.save(character);
  }

  async castSpell(spellName: string, targetName: string) {
    const { spellbookRepository, characterRepository } = this.dependancies;

    const spell = await spellbookRepository.findByName(spellName);
    const character = await characterRepository.findByName(targetName);

    spell.castOn(character.name);
    await characterRepository.save(character);
  }
}

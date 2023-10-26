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

    const damageEvent = weapon.dealDamageTo(character.name);
    const event = character.applyEvent(damageEvent);
    await characterRepository.save(character);

    return {
      eventType: event.type,
      character: character.toDTO(),
    };
  }

  async castSpell(spellName: string, targetName: string) {
    const { spellbookRepository, characterRepository } = this.dependancies;

    const spell = await spellbookRepository.findByName(spellName);
    const character = await characterRepository.findByName(targetName);

    const castSpellEvent = spell.castOn(character.name);
    const event = character.applyEvent(castSpellEvent);
    await characterRepository.save(character);

    return {
      eventType: event.type,
      character: character.toDTO(),
    };
  }
}

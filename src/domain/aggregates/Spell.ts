import { UUID } from "crypto";
import { ActionType, DamageType } from "../../common/resolvers-types.js";
import { SpellBlueprint } from "../../common/types.js";
import { SpellDTO } from "../DTOs/SpellDTO.js";
import { CastSpellEvent, DomainEvent } from "../events/index.js";
import { rollDice } from "../../common/Dice.js";

interface IEntity {
  readonly id: UUID;
}

interface IRootAggregate extends IEntity {}

export class Spell implements IRootAggregate {
  private constructor(
    private event: DomainEvent,
    private spell: {
      id: UUID;
      name: string;
      effect: string;
      type: ActionType;
      damageType: DamageType;
    }
  ) {}

  get id() {
    return this.spell.id;
  }

  castOn(characterName: string) {
    return this.event.emit(
      new CastSpellEvent({
        spellName: this.spell.name,
        targetName: characterName,
        type: this.spell.type,
        effect: rollDice(this.spell.effect),
        damageType: this.spell.damageType,
      })
    );
  }

  toDTO(): SpellDTO {
    return {
      id: this.spell.id,
      name: this.spell.name,
      effect: this.spell.effect,
      type: this.spell.type,
      damageType: this.spell.damageType,
    };
  }

  static create(spellBlueprint: SpellBlueprint, event: DomainEvent): Spell {
    return new Spell(event, {
      id: spellBlueprint.id,
      name: spellBlueprint.name,
      effect: spellBlueprint.effect,
      type: spellBlueprint.type,
      damageType: spellBlueprint.damage_type,
    });
  }
}

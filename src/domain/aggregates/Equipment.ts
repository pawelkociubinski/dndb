import { UUID } from "crypto";
import { EquipmentDTO } from "../DTOs/EquipmentDTO.js";
import { ActionType, DamageType } from "../../common/resolvers-types.js";
import { EquipmentBlueprint } from "../../common/types.js";
import { rollDice } from "../../common/Dice.js";
import { DomainEvent } from "../events/index.js";

interface IEntity {
  readonly id: UUID;
}

interface IRootAggregate extends IEntity {}

export class Equipment implements IRootAggregate {
  private constructor(
    private domainEvent: DomainEvent,
    private equipment: {
      id: UUID;
      name: string;
      effect: string;
      type: ActionType;
      damageType: DamageType;
    }
  ) {}

  get id() {
    return this.equipment.id;
  }

  get name() {
    return this.equipment.name;
  }

  dealDamageTo(characterName: string) {
    this.domainEvent.emit({
      aggregateId: this.equipment.id,
      type: "WEAPON_INFLICTED_DAMAGE",
      payload: {
        sourceName: this.equipment.name,
        targetName: characterName,
        type: this.equipment.type,
        effect: rollDice(this.equipment.effect),
        damageType: this.equipment.damageType,
      },
    });
  }

  toDTO(): EquipmentDTO {
    return {
      id: this.equipment.id,
      name: this.equipment.name,
      effect: this.equipment.effect,
      type: this.equipment.type,
      damageType: this.equipment.damageType,
    };
  }

  static create(
    equipmentBlueprint: EquipmentBlueprint,
    domainEvent: DomainEvent
  ): Equipment {
    return new Equipment(domainEvent, {
      id: equipmentBlueprint.id,
      name: equipmentBlueprint.name,
      effect: equipmentBlueprint.effect,
      type: equipmentBlueprint.type,
      damageType: equipmentBlueprint.damage_type,
    });
  }
}

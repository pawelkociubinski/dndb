import { UUID } from "crypto";
import { EquipmentDTO } from "../DTOs/EquipmentDTO.js";
import { ActionType, DamageType } from "../../common/resolvers-types.js";
import { EquipmentBlueprint } from "../../common/types.js";
import { rollDice } from "../../common/Dice.js";
import { DamageEvent, DomainEvent } from "../events/index.js";

interface IEntity {
  readonly id: UUID;
}

interface IRootAggregate extends IEntity {}

export class Equipment implements IRootAggregate {
  private constructor(
    private event: DomainEvent,
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
    return this.event.emit(
      new DamageEvent({
        weaponName: this.equipment.name,
        targetName: characterName,
        effect: rollDice(this.equipment.effect),
        damageType: this.equipment.damageType,
      })
    );
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
    event: DomainEvent
  ): Equipment {
    return new Equipment(event, {
      id: equipmentBlueprint.id,
      name: equipmentBlueprint.name,
      effect: equipmentBlueprint.effect,
      type: equipmentBlueprint.type,
      damageType: equipmentBlueprint.damage_type,
    });
  }
}

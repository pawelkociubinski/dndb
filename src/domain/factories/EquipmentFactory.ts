import { EquipmentBlueprint } from "../../common/types.js";
import { Equipment } from "../aggregates/Equipment.js";
import { DomainEvent } from "../events/index.js";

interface IDependancies {
  eventStore: DomainEvent;
}

export class EquipmentFactory {
  constructor(private dependancies: IDependancies) {}

  create(equipmentBlueprint: EquipmentBlueprint): Equipment {
    const { eventStore } = this.dependancies;

    return Equipment.create(equipmentBlueprint, eventStore);
  }
}

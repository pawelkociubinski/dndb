import { UUID } from "crypto";
import { IDatabasePort } from "../../domain/ports/IDatabasePort.js";
import { IEquipmentRepositoryPort } from "../../domain/ports/IEquipmentRepositoryPort.js";
import { EquipmentFactory } from "../../domain/factories/EquipmentFactory.js";
import { ActionType, DamageType } from "../../common/resolvers-types.js";

interface IDependancies {
  database: IDatabasePort;
  equipmentFactory: EquipmentFactory;
}

export class EquipmentSQLRepositoryAdapter implements IEquipmentRepositoryPort {
  constructor(private dependancies: IDependancies) {}

  async findByName(equipmentName: string) {
    const { database, equipmentFactory } = this.dependancies;

    try {
      const equipmentBlueprint = await database.query
        .select<
          {
            id: UUID;
            name: string;
            effect: string;
            type: ActionType;
            damage_type: DamageType;
          }[]
        >("*")
        .from("item")
        .where({ name: equipmentName })
        .first();

      if (!equipmentBlueprint) {
        throw new Error("Equipment by that name doesn't exist");
      }

      return equipmentFactory.create(equipmentBlueprint);
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  async findAll() {
    const { database, equipmentFactory } = this.dependancies;

    try {
      const equipmentBlueprints = await database.query
        .select<
          {
            id: UUID;
            name: string;
            effect: string;
            type: ActionType;
            damage_type: DamageType;
          }[]
        >("*")
        .from("item");

      const equipment = equipmentBlueprints.map((equipmentBlueprint) =>
        equipmentFactory.create(equipmentBlueprint)
      );

      return equipment;
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }
}

import { Equipment } from "../aggregates/Equipment.js";

export interface IEquipmentRepositoryPort {
  findByName(equipmentName: string): Promise<Equipment>;
  findAll(): Promise<Equipment[]>;
}

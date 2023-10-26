import { EquipmentDTO } from "../domain/DTOs/EquipmentDTO.js";
import { IEquipmentRepositoryPort } from "../domain/ports/IEquipmentRepositoryPort.js";

interface IDependancies {
  equipmentRepository: IEquipmentRepositoryPort;
}

export class EquipmentService {
  constructor(private dependancies: IDependancies) {}

  async findWeaponsAll(): Promise<EquipmentDTO[]> {
    const { equipmentRepository } = this.dependancies;

    const weapons = await equipmentRepository.findAll();
    return weapons.map((weapon) => weapon.toDTO());
  }
}

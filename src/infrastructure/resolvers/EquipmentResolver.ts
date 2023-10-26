import { GraphQLError } from "graphql";
import { EquipmentService } from "../../application/EquipmentService.js";
import { QueryResolvers } from "../../common/resolvers-types.js";

interface IDependancies {
  equipmentService: EquipmentService;
}

export class EquipmentResolver {
  constructor(private dependancies: IDependancies) {}

  getWeapons: QueryResolvers["getWeapons"] = async () => {
    const { equipmentService } = this.dependancies;

    try {
      return await equipmentService.findWeaponsAll();
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLError("Something goes wrong", {
          originalError: error,
        });
      } else {
        throw new GraphQLError("General Error");
      }
    }
  };
}

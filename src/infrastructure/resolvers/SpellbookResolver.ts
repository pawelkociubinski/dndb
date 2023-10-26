import { GraphQLError } from "graphql";
import { QueryResolvers } from "../../common/resolvers-types.js";
import { SpellbookService } from "../../application/SpellbookService.js";

interface IDependancies {
  spellbookService: SpellbookService;
}

export class SpellbookResolver {
  constructor(private dependancies: IDependancies) {}

  getSpells: QueryResolvers["getSpells"] = async () => {
    const { spellbookService } = this.dependancies;

    try {
      return await spellbookService.findSpellAll();
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

import { z } from "zod";
import { UUID } from "crypto";
import { GraphQLError } from "graphql";
import {
  QueryGetCharacterArgs,
  QueryResolvers,
} from "../../common/resolvers-types.js";
import { CharacterService } from "../../application/CharacterService.js";

interface IDependancies {
  characterService: CharacterService;
}

export class CharacterResolver {
  constructor(private dependancies: IDependancies) {}

  getCharacter: QueryResolvers["getCharacter"] = async (_, args) => {
    const { characterService } = this.dependancies;
    this.getCharacterValidation(args);

    try {
      return await characterService.findById(args.id as UUID);
    } catch (error) {
      throw new GraphQLError("qwe");
    }
  };

  getCharacters: QueryResolvers["getCharacters"] = async () => {
    const { characterService } = this.dependancies;

    try {
      return await characterService.findAll();
    } catch (error) {
      throw new GraphQLError("qwe");
    }
  };

  private getCharacterValidation(args: QueryGetCharacterArgs) {
    const qwe = z.object({
      id: z.string().uuid(),
    });

    try {
      qwe.parse(args);
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  }
}

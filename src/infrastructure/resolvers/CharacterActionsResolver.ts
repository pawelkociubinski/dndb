import { z } from "zod";
import {
  MutationCastSpellArgs,
  MutationMakeAttackArgs,
  MutationResolvers,
} from "../../common/resolvers-types.js";
import { GraphQLError } from "graphql";
import { CharacterActionsService } from "../../application/CharacterActionsService.js";

interface IDependancies {
  characterActionsService: CharacterActionsService;
}

export class CharacterActionsResolver {
  constructor(private dependancies: IDependancies) {}

  makeAttack: MutationResolvers["makeAttack"] = async (_, args) => {
    const { characterActionsService } = this.dependancies;
    const { targetName, weaponName } = args;

    this.makeAttackValidation(args);
    try {
      const result = await characterActionsService.makeAttack(
        weaponName,
        targetName
      );

      switch (result.eventType) {
        case "CHARACTER_RECEIVED_DAMAGE": {
          return {
            character: result.character,
            status: "live",
          };
        }

        case "CHARACTER_DIED": {
          return {
            character: result.character,
            status: "dead",
          };
        }

        default: {
          return {
            character: result.character,
            status:
              "Nothing happened. You know... life is like a box of chocolates - you never know what you're going to get",
          };
        }
      }
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  };

  castSpell: MutationResolvers["castSpell"] = async (_, args) => {
    const { characterActionsService } = this.dependancies;
    const { targetName, spellName } = args;

    this.castSpellValidation(args);
    try {
      const result = await characterActionsService.castSpell(
        spellName,
        targetName
      );

      switch (result.eventType) {
        case "SPELL_CASTED":
        case "CHARACTER_RECEIVED_HEALING": {
          return {
            character: result.character,
            status: "live",
          };
        }

        case "CHARACTER_RECEIVED_DAMAGE": {
          return {
            character: result.character,
            status: "live",
          };
        }

        case "CHARACTER_DIED": {
          return {
            character: result.character,
            status: "dead",
          };
        }

        default: {
          return {
            character: result.character,
            status:
              "Nothing happened. You know... life is like a box of chocolates - you never know what you're going to get",
          };
        }
      }
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  };

  private makeAttackValidation(args: MutationMakeAttackArgs) {
    const schema = z.object({
      targetName: z.string(),
      weaponName: z.string(),
    });

    try {
      schema.parse(args);
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  }

  private castSpellValidation(args: MutationCastSpellArgs) {
    const schema = z.object({
      targetName: z.string(),
      spellName: z.string(),
    });

    try {
      schema.parse(args);
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  }
}

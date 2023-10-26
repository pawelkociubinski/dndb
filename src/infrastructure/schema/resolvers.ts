import { Resolvers } from "../../common/resolvers-types.js";
import { resolvers as scalarResolvers } from "graphql-scalars";
import { CharacterResolver } from "../resolvers/CharacterResolver.js";
import { EquipmentResolver } from "../resolvers/EquipmentResolver.js";
import { SpellbookResolver } from "../resolvers/SpellbookResolver.js";
import { CharacterActionsResolver } from "../resolvers/CharacterActionsResolver.js";

interface IDependencies {
  characterActionsResolver: CharacterActionsResolver;
  characterResolver: CharacterResolver;
  equipmentResolver: EquipmentResolver;
  spellbookResolver: SpellbookResolver;
}

export function createResolvers({
  characterResolver,
  characterActionsResolver,
  spellbookResolver,
  equipmentResolver,
}: IDependencies): Resolvers {
  return {
    ...scalarResolvers,
    Query: {
      getCharacter: characterResolver.getCharacter,
      getCharacters: characterResolver.getCharacters,
      getWeapons: equipmentResolver.getWeapons,
      getSpells: spellbookResolver.getSpells,
    },
    Mutation: {
      makeAttack: characterActionsResolver.makeAttack,
      castSpell: characterActionsResolver.castSpell,
    },
  };
}

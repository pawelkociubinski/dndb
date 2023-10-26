import { UUID } from "crypto";
import { IDatabasePort } from "../../domain/ports/IDatabasePort.js";
import { ActionType, DamageType } from "../../common/resolvers-types.js";
import { SpellFactory } from "../../domain/factories/SpellFactory.js";
import { ISpellbookRepositoryPort } from "../../domain/ports/ISpellbookRepositoryPort.js";

interface IDependancies {
  database: IDatabasePort;
  spellFactory: SpellFactory;
}

export class SpellbookSQLRepositoryAdapter implements ISpellbookRepositoryPort {
  constructor(private dependancies: IDependancies) {}

  async findSpellAll() {
    const { database, spellFactory } = this.dependancies;

    try {
      const spellBlueprints = await database.query
        .select<
          {
            id: UUID;
            name: string;
            effect: string;
            type: ActionType;
            damage_type: DamageType;
          }[]
        >("*")
        .from("spell");

      const spells = spellBlueprints.map((spellBlueprint) =>
        spellFactory.create(spellBlueprint)
      );

      return spells;
    } catch (error) {
      throw new Error("SQL error");
    }
  }

  async findByName(spellName: string) {
    const { database, spellFactory } = this.dependancies;

    try {
      const spellBlueprint = await database.query
        .select<{
          id: UUID;
          name: string;
          effect: string;
          type: ActionType;
          damage_type: DamageType;
        }>("*")
        .from("spell")
        .where({ name: spellName })
        .first();

      if (!spellBlueprint) {
        throw new Error("Spell by that name doesn't exist");
      }
      return spellFactory.create(spellBlueprint);
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }
}

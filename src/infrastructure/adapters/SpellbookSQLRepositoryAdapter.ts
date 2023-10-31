import { UUID } from "crypto";
import { IDatabasePort } from "../../domain/ports/IDatabasePort.js";
import { ActionType, DamageType } from "../../common/resolvers-types.js";
import { SpellFactory } from "../../domain/factories/SpellFactory.js";
import { ISpellbookRepositoryPort } from "../../domain/ports/ISpellbookRepositoryPort.js";
import { SystemError } from "../../common/error.js";

interface IDependancies {
  database: IDatabasePort;
  spellFactory: SpellFactory;
}

export class SpellbookSQLRepositoryAdapter implements ISpellbookRepositoryPort {
  constructor(private dependancies: IDependancies) {}

  async findSpellAll() {
    const { database, spellFactory } = this.dependancies;

    try {
      const spellBlueprints = await database.query("spell").select<
        {
          id: UUID;
          name: string;
          effect: string;
          type: ActionType;
          damage_type: DamageType;
        }[]
      >("*");
      const spells = spellBlueprints.map((spellBlueprint) =>
        spellFactory.create({
          ...spellBlueprint,
          damageType: spellBlueprint.damage_type,
        })
      );

      return spells;
    } catch (error) {
      throw new SystemError({ message: "SQL error" });
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
        throw new SystemError({
          message: "Spell by that name doesn't exist",
          extraInfo: {
            spellName,
          },
        });
      }
      return spellFactory.create({
        ...spellBlueprint,
        damageType: spellBlueprint.damage_type,
      });
    } catch (error) {
      throw new SystemError({ message: "SQL error" });
    }
  }
}

import { Character } from "../../domain/aggregates/Character.js";
import { IDatabasePort } from "../../domain/ports/IDatabasePort.js";
import { ICharacterRepositoryPort } from "../../domain/ports/ICharacterRespositoryPort.js";
import { UUID } from "crypto";
import { CharacterBlueprint } from "../../common/characterBlueprint.js";
import {
  BasicCharacter,
  CharacterClass,
  CharacterStats,
  Class,
  Item,
  ItemModifier,
} from "../../common/knex-types.js";
import _ from "lodash";
import {
  CharacterFactory,
  DetailedCharacter,
} from "../../domain/factories/CharacterFactory.js";
import { CharacterTransaction } from "../repositories/SaveCharacterTransaction.js";
import { DamageType, Defense } from "../../common/resolvers-types.js";
import { rollDice } from "../../common/Dice.js";

interface IDependancies {
  database: IDatabasePort;
  characterFactory: CharacterFactory;
}

export class CharacterSQLRepositoryAdapter implements ICharacterRepositoryPort {
  constructor(private dependancies: IDependancies) {}

  async findAll() {
    const { database } = this.dependancies;

    try {
      const characterIds = await database.query
        .select<{ id: UUID }[]>("id")
        .from("character")
        .then((characters) => {
          return characters.map((character) => character.id);
        });

      return await Promise.all(
        characterIds.map(
          async (characterId) => await this.findById(characterId)
        )
      );
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  async findById(characterId: UUID) {
    const { characterFactory } = this.dependancies;

    try {
      const [
        basicCharacter,
        characterClasses,
        characterItemsWithModifiers,
        characterResistance,
        characterStats,
      ] = await Promise.all([
        this.findBasicCharacterById(characterId),
        this.findClassesByCharacterId(characterId),
        this.findItemsWithModifiersByCharacterId(characterId),
        this.findResistanceByCharacterId(characterId),
        this.findStatsByCharacterId(characterId),
      ]);

      const detailedCharacter = {
        id: basicCharacter.id,
        name: basicCharacter.name,
        level: basicCharacter.level,
        maxHitPoints: basicCharacter.max_hitpoints,
        currentHitPoints: basicCharacter.current_hitpoints,
        temporaryHitPoints: basicCharacter.temporary_hitpoints,
        classes: characterClasses.map((characterClass) => ({
          name: characterClass.name,
          hitDiceValue: characterClass.hit_dice_value,
          classLevel: characterClass.class_level,
        })),
        stats: characterStats,
        items: characterItemsWithModifiers.map((item) => ({
          id: item.id,
          name: item.name,
          modifier: {
            affectedObject: item.affected_object,
            affectedValue: item.affected_value,
            value: item.value,
          },
        })),
        defenses: characterResistance.map((resistance) => ({
          type: resistance.resistance_type,
          defense: resistance.resistance_defense,
        })),
      } satisfies DetailedCharacter;

      return characterFactory.create(detailedCharacter);
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  async findByName(characterName: string) {
    const { characterFactory } = this.dependancies;

    try {
      const basicCharacter = await this.findBasicCharacterByName(characterName);

      const [
        characterClasses,
        characterItemsWithModifiers,
        characterResistance,
        characterStats,
      ] = await Promise.all([
        this.findClassesByCharacterId(basicCharacter.id),
        this.findItemsWithModifiersByCharacterId(basicCharacter.id),
        this.findResistanceByCharacterId(basicCharacter.id),
        this.findStatsByCharacterId(basicCharacter.id),
      ]);

      const detailedCharacter = {
        id: basicCharacter.id,
        name: basicCharacter.name,
        level: basicCharacter.level,
        maxHitPoints: basicCharacter.max_hitpoints,
        currentHitPoints: basicCharacter.current_hitpoints,
        temporaryHitPoints: basicCharacter.temporary_hitpoints,
        classes: characterClasses.map((characterClass) => ({
          name: characterClass.name,
          hitDiceValue: characterClass.hit_dice_value,
          classLevel: characterClass.class_level,
        })),
        stats: characterStats,
        items: characterItemsWithModifiers.map((item) => ({
          id: item.id,
          name: item.name,
          modifier: {
            affectedObject: item.affected_object,
            affectedValue: item.affected_value,
            value: item.value,
          },
        })),
        defenses: characterResistance.map((resistance) => ({
          type: resistance.resistance_type,
          defense: resistance.resistance_defense,
        })),
      } satisfies DetailedCharacter;

      return characterFactory.create(detailedCharacter);
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  async createByBlueprint(characterBlueprint: CharacterBlueprint) {
    const { database } = this.dependancies;
    const { classes, hitPoints } = characterBlueprint;

    try {
      const bonusHitPoints =
        await this.calculateBonusHitPointsByClasses(classes);
      const totalHitPoints = hitPoints + bonusHitPoints;

      const trx = await database.query.transaction();
      const characterTransaction = new CharacterTransaction(trx);

      await characterTransaction.create({
        ...characterBlueprint,
        hitPoints: totalHitPoints,
        defenses: _.map(characterBlueprint.defenses, (defense) =>
          _.mapValues(defense, (value) => value.toUpperCase())
        ),
      });

      console.log("Successfuly created a new character!");
    } catch (error) {
      console.log(
        "The character hasn't been saved. It probably already exists."
      );
    }
  }

  async save(character: Character) {
    const { database } = this.dependancies;

    const trx = await database.query.transaction();
    const characterTransaction = new CharacterTransaction(trx);

    const characterDTO = character.toDTO();
    void characterTransaction.save(characterDTO);
  }

  private async calculateBonusHitPointsByClasses(
    classes: CharacterBlueprint["classes"]
  ) {
    return await classes.reduce(async (acc, { name, classLevel }) => {
      const awaitedAcc = await acc;
      const { hit_dice_value } = await this.findClassByName(name);
      const result = rollDice(`${classLevel}d${hit_dice_value}`); // for Briv it wil be 5d10

      return awaitedAcc + result;
    }, Promise.resolve(0));
  }

  private async findBasicCharacterByName(characterName: string) {
    const { database } = this.dependancies;

    try {
      const basicCharacter = await database.query
        .select<{
          id: UUID;
          name: string;
          level: number;
          max_hitpoints: number;
          current_hitpoints: number;
          temporary_hitpoints: number;
        }>("*")
        .from("character")
        .where({ name: characterName })
        .first();

      if (!basicCharacter) {
        // TODO: Implement error handling logic
        throw new Error("Character with the given name doesn't exist");
      }

      return basicCharacter;
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  private async findBasicCharacterById(characterId: UUID) {
    const { database } = this.dependancies;

    try {
      const basicCharacter = await database.query
        .select<BasicCharacter>("*")
        .from("character")
        .where({ id: characterId })
        .first();

      if (!basicCharacter) {
        // TODO: Implement error handling logic
        throw new Error("Character with the given id doesn't exist");
      }

      return basicCharacter;
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  private async findClassesByCharacterId(characterId: UUID) {
    const { database } = this.dependancies;

    try {
      const characterClasses = await database.query
        .select<
          {
            name: Class["name"];
            hit_dice_value: Class["hit_dice_value"];
            class_level: CharacterClass["class_level"];
          }[]
        >("class.name", "class.hit_dice_value", "character_class.class_level")
        .from("character_class")
        .join("class", "character_class.class_name", "=", "class.name")
        .where("character_class.character_id", characterId);

      return characterClasses;
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  private async findItemsWithModifiersByCharacterId(characterId: UUID) {
    const { database } = this.dependancies;

    try {
      const characterItemsWithModifiers = await database.query
        .select<
          {
            id: Item["id"];
            name: Item["name"];
            affected_object: ItemModifier["affected_object"];
            affected_value: ItemModifier["affected_value"];
            value: ItemModifier["value"];
          }[]
        >(
          "item.id",
          "item.name",
          "item_modifier.affected_object",
          "item_modifier.affected_value",
          "item_modifier.value"
        )
        .from("item")
        .join("character_item", "item.id", "=", "character_item.item_id")
        .join("item_modifier", "item.id", "=", "item_modifier.item_id")
        .where("character_item.character_id", characterId);

      return characterItemsWithModifiers;
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  private async findResistanceByCharacterId(characterId: UUID) {
    const { database } = this.dependancies;

    try {
      const characterDefenses = await database.query
        .select<
          {
            resistance_type: DamageType;
            resistance_defense: Defense;
          }[]
        >("resistance_type", "resistance_defense")
        .from("character_resistance")
        .where("character_id", characterId);

      return characterDefenses;
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  private async findStatsByCharacterId(characterId: UUID) {
    const { database } = this.dependancies;

    try {
      const characterStats = await database.query
        .select<Omit<CharacterStats, "character_id">>(
          "strength",
          "dexterity",
          "constitution",
          "intelligence",
          "wisdom",
          "charisma"
        )
        .from("character_stats")
        .where("character_id", characterId)
        .first();

      if (!characterStats) {
        // TODO: Implement error handling logic
        throw new Error("statistics for this character doesn't exist");
      }

      return characterStats;
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }

  private async findClassByName(className: string) {
    const { database } = this.dependancies;

    try {
      const _class = await database.query
        .select<{ name: string; hit_dice_value: number }>("*")
        .from("class")
        .where({ name: className })
        .first();

      if (!_class) {
        throw new Error("Klasa nie istnieje");
      }
      return _class;
    } catch (error) {
      // TODO: Implement error handling logic
      throw new Error("SQL error");
    }
  }
}

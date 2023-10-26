import _ from "lodash";
import { UUID } from "crypto";
import { CharacterBlueprint } from "../../common/characterBlueprint.js";
import { Knex } from "knex";
import { CharacterDTO } from "../../domain/DTOs/CharacterDTO.js";
import { v4 as uuidv4 } from "uuid";

export class CharacterTransaction {
  constructor(private trx: Knex.Transaction) {}

  async create(characterBlueprint: CharacterBlueprint) {
    const characterId = uuidv4() as UUID;
    const temporaryHitPoints = 0;

    await this.insertBasicCharacter(
      characterId,
      characterBlueprint.name,
      characterBlueprint.level,
      characterBlueprint.hitPoints,
      characterBlueprint.hitPoints,
      temporaryHitPoints
    );

    await this.insertCharacterStats(characterId, characterBlueprint.stats);

    await Promise.all(
      characterBlueprint.classes.map(async (blueprintClass) => {
        await this.insertCharacterClass(
          characterId,
          blueprintClass.name,
          blueprintClass.classLevel
        );
      })
    );

    await Promise.all(
      characterBlueprint.items.map(async (blueprintItem) => {
        const item = await this.selectItemByName(blueprintItem.name);

        await this.insertCharacterItem(characterId, item.id);
        await this.insertItemModifier(item.id, blueprintItem.modifier);
      })
    );

    await Promise.all(
      characterBlueprint.defenses.map(async (blueprintDefense) => {
        await this.insertResistanceIfNotExists(
          blueprintDefense.type,
          blueprintDefense.defense
        );
        await this.insertCharacterResistance(characterId, {
          type: blueprintDefense.type,
          defense: blueprintDefense.defense,
        });
      })
    );

    await this.trx.commit();
  }

  async save(characterDTO: CharacterDTO): Promise<void> {
    await this.updateBasicCharacter(
      characterDTO.id,
      characterDTO.name,
      characterDTO.level,
      characterDTO.maxHitPoints,
      characterDTO.currentHitPoints,
      characterDTO.temporaryHitPoints
    );

    await this.trx.commit();
  }

  private async selectItemByName(itemName: string) {
    try {
      const item = await this.trx
        .select<{ id: UUID; name: string }>("id", "name")
        .from("item")
        .where({ name: itemName })
        .first();

      if (!item) {
        await this.trx.rollback();
        throw new Error("Item doesn't exists");
      }

      return item;
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }

  private async insertResistanceIfNotExists(type: string, defense: string) {
    try {
      await this.trx
        .insert({ type, defense })
        .into("resistance")
        .onConflict(["type", "defense"])
        .ignore();
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }

  private async insertCharacterResistance(
    characterId: UUID,
    resistance: { type: string; defense: string }
  ) {
    try {
      await this.trx
        .insert({
          character_id: characterId,
          resistance_type: resistance.type,
          resistance_defense: resistance.defense,
        })
        .into("character_resistance");
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }

  private async insertItemModifier(
    itemId: UUID,
    itemModifier: {
      affectedObject: string;
      affectedValue: string;
      value: number;
    }
  ) {
    try {
      await this.trx
        .insert({
          item_id: itemId,
          affected_object: itemModifier.affectedObject,
          affected_value: itemModifier.affectedValue,
          value: itemModifier.value,
        })
        .into("item_modifier");
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }

  private async insertCharacterItem(characterId: UUID, itemId: UUID) {
    try {
      await this.trx
        .insert({
          character_id: characterId,
          item_id: itemId,
        })
        .into("character_item");
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }

  private async insertCharacterStats(
    characterId: UUID,
    characterStats: {
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
    }
  ) {
    try {
      await this.trx
        .insert({
          character_Id: characterId,
          ...characterStats,
        })
        .into("character_stats");
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }

  private async insertCharacterClass(
    characterId: UUID,
    className: string,
    classLevel: number
  ) {
    try {
      await this.trx
        .insert({
          character_id: characterId,
          class_name: className,
          class_level: classLevel,
        })
        .into("character_class");
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }

  private async insertBasicCharacter(
    characterId: UUID,
    characterName: string,
    characterLevel: number,
    characterMaxHitPoints: number,
    characterCurrentHitPoints: number,
    characterTemporaryHitPoints: number
  ) {
    try {
      await this.trx
        .insert({
          id: characterId,
          name: characterName,
          level: characterLevel,
          max_hitpoints: characterMaxHitPoints,
          current_hitpoints: characterCurrentHitPoints,
          temporary_hitpoints: characterTemporaryHitPoints,
        })
        .into("character");
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }

  private async updateBasicCharacter(
    characterId: UUID,
    characterName: string,
    characterLevel: number,
    characterMaxHitPoints: number,
    characterCurrentHitPoints: number,
    characterTemporaryHitPoints: number
  ) {
    try {
      await this.trx
        .update({
          id: characterId,
          name: characterName,
          level: characterLevel,
          max_hitpoints: characterMaxHitPoints,
          current_hitpoints: characterCurrentHitPoints,
          temporary_hitpoints: characterTemporaryHitPoints,
        })
        .into("character")
        .where({ id: characterId });
    } catch (error) {
      await this.trx.rollback();
      // TODO: Implement error handling logic
      throw new Error("ROLLBACK");
    }
  }
}

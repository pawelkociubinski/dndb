import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("type_damage", function (table) {
    table.string("name").primary();
  });

  await knex("type_damage").insert([
    { name: "NONE" },
    { name: "ACID" },
    { name: "BLUDGEONING" },
    { name: "COLD" },
    { name: "FIRE" },
    { name: "FORCE" },
    { name: "LIGHTNING" },
    { name: "NECROTIC" },
    { name: "PIERCING" },
    { name: "POISON" },
    { name: "PSYCHIC" },
    { name: "RADIANT" },
    { name: "SLASHING" },
    { name: "THUNDER" },
  ]);

  /**
   * Items are unique in their essence.
   * I might as well remove ids,
   * but I leave them for the sake of example,
   * since ids uses as indeterminators with entities and aggregates.
   */
  /**
   * In a reallife implementation,
   * I would add an additional "type" column.
   * Because the item doesn't have to be a weapon.
   * It could be - for example - food, a toy, etc.
   */
  await knex.schema.createTable("item", function (table) {
    table.uuid("id").primary();
    table.string("name").unique().notNullable();
    table.string("effect").notNullable();
    table.string("type").notNullable();
    table
      .string("damage_type")
      .notNullable()
      .references("name")
      .inTable("type_damage");
  });

  await knex("item").insert([
    {
      id: uuidv4(),
      name: "Ioun Stone of Fortitude",
      effect: "1d6+3",
      type: "DAMAGE",
      damage_type: "SLASHING",
    },
    {
      id: uuidv4(),
      name: "Stick of Destiny",
      effect: "1d6+2",
      type: "DAMAGE",
      damage_type: "BLUDGEONING",
    },
    {
      id: uuidv4(),
      name: "Needle Sword",
      effect: "1d6",
      type: "DAMAGE",
      damage_type: "PIERCING",
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("type_damage");
  await knex.schema.dropTable("item");
}

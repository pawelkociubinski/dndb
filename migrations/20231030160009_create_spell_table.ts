import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("spell", function (table) {
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

  await knex("spell").insert([
    {
      id: uuidv4(),
      name: "Healing Word",
      effect: "1d6+3",
      type: "HEALING",
      damage_type: "NONE",
    },
    {
      id: uuidv4(),
      name: "Fireball",
      effect: "1d10+2",
      type: "DAMAGE",
      damage_type: "FIRE",
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("spell");
}

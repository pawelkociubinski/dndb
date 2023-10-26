import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("class", function (table) {
    table.string("name").primary();
    table.integer("hit_dice_value").notNullable();
  });

  await knex("class").insert([
    { name: "bard", hit_dice_value: 8 },
    { name: "cleric", hit_dice_value: 8 },
    { name: "druid", hit_dice_value: 8 },
    { name: "ranger", hit_dice_value: 10 },
    { name: "rogue", hit_dice_value: 8 },
    { name: "fighter", hit_dice_value: 10 },
    { name: "wizard", hit_dice_value: 6 },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("class");
}

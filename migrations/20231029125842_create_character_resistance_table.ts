import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("character_resistance", function (table) {
    table
      .uuid("character_id")
      .references("id")
      .inTable("character")
      .onDelete("CASCADE");
    table.string("resistance_type").notNullable();
    table.string("resistance_defense").notNullable();

    table
      .foreign(["resistance_type", "resistance_defense"])
      .references(["type", "defense"])
      .inTable("defense")
      .onDelete("CASCADE");
    table.primary(["character_id", "resistance_type", "resistance_defense"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("character_resistance");
}

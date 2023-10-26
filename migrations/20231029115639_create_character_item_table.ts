import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("character_item", function (table) {
    table
      .uuid("character_id")
      .references("id")
      .inTable("character")
      .onDelete("CASCADE");
    table.uuid("item_id").references("id").inTable("item").onDelete("CASCADE");

    table.primary(["character_id", "item_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("character_item");
}

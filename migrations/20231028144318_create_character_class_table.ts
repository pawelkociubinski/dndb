import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("character_class", function (table) {
    table
      .uuid("character_id")
      .references("id")
      .inTable("character")
      .onDelete("CASCADE")
      .index();
    table
      .uuid("class_name")
      .references("name")
      .inTable("class")
      .onDelete("CASCADE");
    table.integer("class_level").notNullable().defaultTo(1);

    table.primary(["character_id", "class_name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("character_class");
}

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  /**
   * foreign key is also a primary key because there is a one-to-one relationship here.
   * A single item can only have one modifier on it.
   */
  await knex.schema.createTable("item_modifier", function (table) {
    table
      .uuid("item_id")
      .primary()
      .references("id")
      .inTable("item")
      .onDelete("CASCADE");
    table.string("affected_object").notNullable();
    table.string("affected_value").notNullable();
    table.integer("value").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("item_modifier");
}

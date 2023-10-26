import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  /**
   * I intentionaly marked the character's name as uniq
   * because there is no concept of user accounts.
   * Simpy I wanted to provide option to avoid creating duplicates.
   */
  await knex.schema.createTable("character", function (table) {
    table.uuid("id").primary();
    table.string("name").notNullable().unique().index();
    table.integer("level").notNullable().defaultTo(1);
    table.integer("current_hitpoints").notNullable();
    table.integer("max_hitpoints").notNullable();
    table.integer("temporary_hitpoints").notNullable();
  });

  await knex.schema.createTable("character_stats", function (table) {
    table
      .uuid("character_id")
      .primary()
      .references("id")
      .inTable("character")
      .onDelete("CASCADE");
    table.integer("strength").notNullable();
    table.integer("dexterity").notNullable();
    table.integer("constitution").notNullable();
    table.integer("intelligence").notNullable();
    table.integer("wisdom").notNullable();
    table.integer("charisma").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("character_stats");
  await knex.schema.dropTable("character");
}

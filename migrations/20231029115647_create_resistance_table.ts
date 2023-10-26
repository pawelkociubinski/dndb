import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("resistance", function (table) {
    table.string("type").notNullable();
    table.string("defense").notNullable();

    table.primary(["type", "defense"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("resistance");
}

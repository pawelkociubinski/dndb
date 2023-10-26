import path from "node:path";
import { IDatabasePort } from "../../domain/ports/IDatabasePort.js";
import knex from "knex";

export class SQLDatabaseAdapter implements IDatabasePort {
  private db = knex({
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: path.join(process.cwd(), "db.sqlite"),
    },
  });

  get query() {
    return this.db;
  }
}

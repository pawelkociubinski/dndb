import path from "node:path";
import knex from "knex";
import { IDatabasePort } from "../../domain/ports/IDatabasePort.js";

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

  async close(): Promise<void> {
    return this.db.destroy();
  }
}

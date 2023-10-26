import path from "node:path";
import type { Knex } from "knex";

export default {
  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      debug: true,
      filename: path.join(process.cwd(), "db.sqlite"),
    },
  },
} satisfies { [key: string]: Knex.Config };

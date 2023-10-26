import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { logger } from "../config.js";

export type IDatabase = {
  readonly db: Db;
  close(): Promise<void>;
};

export class SQLDatabase implements IDatabase {
  private static instance: SQLDatabase;
  private client: MongoClient;
  private database: Db;

  private constructor() {
    this.client = new MongoClient(
      `${process.env.DATABASE_URL}?retryWrites=true&w=majority`,
      {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      }
    );
    this.database = this.client.db(process.env.DB_NAME);

    this.connect();
  }

  get db() {
    return this.database;
  }

  async close() {
    await this.client.close();
  }

  private async connect() {
    try {
      await this.db.command({ ping: 1 });
      logger.info("Successfully connected to MongoDB.");
    } catch (error: unknown) {
      // TODO
      logger.fatal("Database connection error!", error);
      await this.close();
      process.exit(1);
    }
  }

  static async getInstance() {
    if (!SQLDatabase.instance) {
      SQLDatabase.instance = new SQLDatabase();
    }

    return SQLDatabase.instance;
  }
}

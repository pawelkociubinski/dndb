import { UUID } from "crypto";
import { Knex } from "knex";

export interface ICharacterTable {
  id: UUID;
  name: string;
  level: number;
  current_hitpoints: number;
  max_hitpoints: number;
}

export interface IDatabasePort {
  readonly query: Knex;
}

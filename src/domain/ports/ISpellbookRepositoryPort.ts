import { Spell } from "../aggregates/Spell.js";

export interface ISpellbookRepositoryPort {
  findSpellAll(): Promise<Spell[]>;
  findByName(spellName: string): Promise<Spell>;
}

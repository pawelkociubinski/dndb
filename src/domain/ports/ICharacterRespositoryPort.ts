import { UUID } from "crypto";
import { Character } from "../aggregates/Character.js";
import { CharacterBlueprint } from "../../common/characterBlueprint.js";

export interface ICharacterRepositoryPort {
  save(character: Character): Promise<void>;
  findAll(): Promise<Character[]>;
  findById(id: UUID): Promise<Character>;
  findByName(characterName: string): Promise<Character>;
  createByBlueprint(characterBlueprint: CharacterBlueprint): Promise<void>;
}

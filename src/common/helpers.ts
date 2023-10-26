import { CharacterService } from "../application/CharacterService.js";
import { IDatabasePort } from "../domain/ports/IDatabasePort.js";
import brivBlueprint from "../initialData.json" assert { type: "json" };

interface IDependancies {
  characterService: CharacterService;
  database: IDatabasePort;
}

export async function loadInitialCharacter(dependancies: IDependancies) {
  const { database, characterService } = dependancies;
  try {
    await database.query("character").del();
    await database.query("character_stats").del();
    await database.query("character_class").del();
    await database.query("character_item").del();
    await database.query("item_modifier").del();
    await database.query("character_resistance").del();
    await characterService.createCharacterFromBlueprint(brivBlueprint);
  } catch (error) {
    console.log("Character creation aborted. Briv already exists");
  }
}

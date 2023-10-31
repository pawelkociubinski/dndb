import { CharacterService } from "../application/CharacterService.js";
import { IDatabasePort } from "../domain/ports/IDatabasePort.js";
import brivBlueprint from "../initialData.json" assert { type: "json" };

interface IDependancies {
  characterService: CharacterService;
  database: IDatabasePort;
}

export async function loadInitialCharacter({
  database,
  characterService,
}: IDependancies) {
  const { query } = database;
  try {
    await query("character").del();
    await query("character_stats").del();
    await query("character_class").del();
    await query("character_item").del();
    await query("item_modifier").del();
    await query("character_resistance").del();
    await characterService.createFromBlueprint(brivBlueprint);
  } catch (error) {
    console.log("Character creation aborted. Briv already exists");
  }
}

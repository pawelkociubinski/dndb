import { Defense } from "../valueObjects/Defense.js";
import { ItemModifier } from "../valueObjects/ItemModifier.js";
import { Stat } from "../valueObjects/Stat.js";
import { CharacterClass } from "./CharacterClass.js";
import { Item } from "./Item.js";

interface IRootAggregate {
  id: string;
}

export class Hero implements IRootAggregate {
  constructor(
    public id: string,
    private name: string,
    private level: number,
    private hitPoints: number,
    private stats: Stat,
    private classes: CharacterClass[],
    private items: Item[],
    private defenses: Defense[]
  ) {}

  applyModifier(modifier: ItemModifier): void {
    if (modifier.affectedObject === "stats") {
      // Modify the stats based on the provided modifier. For simplicity, only handling constitution here.
      if (modifier.affectedValue === "constitution") {
        this.stats.constitution += modifier.value;
      }
      // Handle other stats similarly...
    }
  }

  receiveDamage() {}

  attack();
}

import { UUID } from "crypto";
import { ItemModifier } from "../valueObjects/ItemModifier.js";

interface IEntity {
  getId: () => UUID;
}

export class CharacterItem implements IEntity {
  constructor(
    private properties: {
      id: UUID;
      name: string;
      modifier: ItemModifier;
    }
  ) {}

  readModifier() {
    return this.properties.modifier.properties;
  }

  toDTO() {
    return {
      id: this.properties.id,
      name: this.properties.name,
      modifier: this.properties.modifier.toDTO(),
    };
  }

  getId() {
    return this.properties.id;
  }
}

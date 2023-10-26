import { ItemModifier } from "../valueObjects/ItemModifier.js";

export interface Entity {
  id: string;
}

export class Item {
  constructor(
    public id: string,
    private name: string,
    private modifier: ItemModifier
  ) {}
}

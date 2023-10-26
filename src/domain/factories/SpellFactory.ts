import { SpellBlueprint } from "../../common/types.js";
import { Spell } from "../aggregates/Spell.js";
import { DomainEvent } from "../events/index.js";

interface IDependancies {
  eventStore: DomainEvent;
}

export class SpellFactory {
  constructor(private dependancies: IDependancies) {}

  create(spellBlueprint: SpellBlueprint): Spell {
    const { eventStore } = this.dependancies;

    return Spell.create(spellBlueprint, eventStore);
  }
}

import { UUID } from "crypto";
import { Spell } from "../aggregates/Spell.js";
import { DomainEvent } from "../events/index.js";
import { ActionType, DamageType } from "../../common/resolvers-types.js";
import _ from "lodash";

interface IDependancies {
  eventStore: DomainEvent;
}

export interface SpellBlueprint {
  id: UUID;
  name: string;
  effect: string;
  type: ActionType;
  damageType: DamageType;
}

export class SpellFactory {
  constructor(private dependancies: IDependancies) {}

  create(spellBlueprint: SpellBlueprint): Spell {
    const { eventStore } = this.dependancies;

    return Spell.create(spellBlueprint, eventStore);
  }
}

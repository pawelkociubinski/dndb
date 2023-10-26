import { ActionType, DamageType } from "../../common/resolvers-types.js";
import { Whatever } from "../../common/types.js";

export interface Event<TPayload = Whatever> {
  occurredAt: Date;
  type: string;
  payload?: TPayload;
}

export interface DomainEvent {
  emit<T extends Event>(args: T): T;
}

export interface DeathPayload {
  characterName: string;
}

export interface DamagePayload {
  weaponName: string;
  targetName: string;
  effect: number;
  damageType: DamageType;
}

export interface ReceiveDamagePayload {
  characterName: string;
  effect: number;
  damageDealt: number;
  hitPointsLeft: number;
}

export interface SpellPayload {
  spellName: string;
  targetName: string;
  type: ActionType;
  effect: number;
  damageType: DamageType;
}

export class DeathEvent implements Event<DeathPayload> {
  public readonly occurredAt: Date = new Date();
  public type = "CHARACTER_DIED";

  constructor(public payload: DeathPayload) {
    console.log(`${payload.characterName} is dead`);
  }
}

export class DamageEvent implements Event<DamagePayload> {
  public readonly occurredAt: Date = new Date();
  public type = "WEAPON_INFLICTED_DAMAGE";

  constructor(public payload: DamagePayload) {
    console.log(
      `Player attacked ${payload.targetName} with the ${payload.weaponName}!`
    );
  }
}

export class ReceiveDamageEvent implements Event<ReceiveDamagePayload> {
  public readonly occurredAt: Date = new Date();
  public type = "CHARACTER_RECEIVED_DAMAGE";

  constructor(public payload: ReceiveDamagePayload) {
    console.log(
      `${payload.characterName} received ${payload.damageDealt} damage points. ${payload.hitPointsLeft} life points left!`
    );

    if (payload.damageDealt < payload.effect) {
      console.log(
        `Damage was reduced by the character's immunities. It paid to eat well and do regular exercise!`
      );
    }
  }
}

export class CastSpellEvent implements Event<SpellPayload> {
  public readonly occurredAt: Date = new Date();
  public type = "SPELL_CASTED";

  constructor(public payload: SpellPayload) {
    console.log(
      `Player casted ${payload.spellName} spell on ${payload.targetName}`
    );
  }
}

export class NothingHappenEvent implements Event {
  public readonly occurredAt: Date = new Date();
  public type = "NOTHING_HAPPENED";

  constructor() {}
}

interface ReceiveHealingPayload {
  targetName: string;
  effect: number;
  hitPoints: number;
}

export class ReceiveHealingEvent implements Event<ReceiveHealingPayload> {
  public readonly occurredAt: Date = new Date();
  public type = "CHARACTER_RECEIVED_HEALING";

  constructor(public payload: ReceiveHealingPayload) {
    console.log(
      `${payload.targetName} was healed by ${payload.effect} hitpoints`
    );
  }
}

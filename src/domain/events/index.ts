import { ActionType, DamageType } from "../../common/resolvers-types.js";

export interface IEvent {
  aggregateId: string;
  type: string;
  payload: any;
}

export interface DomainEvent {
  emit(args: IEvent): void;
  subscribe(eventType: string, callback: (event: IEvent) => void): void;
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

interface ReceiveHealingPayload {
  targetName: string;
  effect: number;
  hitPoints: number;
}

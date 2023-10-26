import _ from "lodash";
import { UUID } from "crypto";
import { ItemModifier } from "../valueObjects/ItemModifier.js";
import { CharacterStats, Properties } from "../valueObjects/CharacterStats.js";
import { CharacterClass } from "../valueObjects/CharacterClass.js";
import { CharacterItem } from "../entity/CharacterItem.js";
import { CharacterDefense } from "../valueObjects/CharacterDefense.js";
import { DetailedCharacter } from "../factories/CharacterFactory.js";
import { CharacterDTO } from "../DTOs/CharacterDTO.js";
import {
  ActionType,
  DamageType,
  Defense,
} from "../../common/resolvers-types.js";
import {
  Event,
  DeathEvent,
  DomainEvent,
  ReceiveDamageEvent,
  DamagePayload,
  NothingHappenEvent,
  SpellPayload,
  ReceiveHealingEvent,
} from "../events/index.js";

interface IEntity {
  readonly id: UUID;
}

interface IRootAggregate extends IEntity {}

export class Character implements IRootAggregate {
  private constructor(
    private event: DomainEvent,
    private character: {
      id: UUID;
      name: string;
      level: number;
      maxHitPoints: number;
      currentHitPoints: number;
      temporaryHitPoints: number;
      classes: CharacterClass[];
      stats: CharacterStats;
      items: CharacterItem[];
      defenses: CharacterDefense[];
    }
  ) {}

  get isAlive() {
    return this.character.currentHitPoints > 0;
  }

  get id() {
    return this.character.id;
  }

  get name() {
    return this.character.name;
  }

  heal(spell: SpellPayload) {
    if (this.isAlive) {
      this.character.currentHitPoints = Math.min(
        this.character.maxHitPoints,
        this.character.currentHitPoints + spell.effect
      );

      return this.event.emit(
        new ReceiveHealingEvent({
          targetName: this.character.name,
          effect: spell.effect,
          hitPoints: this.character.currentHitPoints,
        })
      );
    } else {
      return this.event.emit(
        new DeathEvent({
          characterName: this.character.name,
        })
      );
    }
  }

  applyEvent<T extends Event>(event: T) {
    switch (event.type) {
      case "WEAPON_INFLICTED_DAMAGE": {
        return this.ReceiveDamage(event.payload);
      }

      case "SPELL_CASTED": {
        if (event.payload.type === ActionType.Healing) {
          return this.heal(event.payload);
        } else {
          return this.ReceiveDamage(event.payload);
        }
      }

      default: {
        return this.event.emit(new NothingHappenEvent());
      }
    }
  }

  toDTO(): CharacterDTO {
    return {
      id: this.character.id,
      name: this.character.name,
      level: this.character.level,
      maxHitPoints: this.character.maxHitPoints,
      currentHitPoints: this.character.currentHitPoints,
      temporaryHitPoints: this.character.temporaryHitPoints,
      classes: this.character.classes.map((_class) => _class.toDTO()),
      stats: this.character.stats.toDTO(),
      items: this.character.items.map((item) => item.toDTO()),
      defenses: this.character.defenses.map((defense) => defense.toDTO()),
    };
  }

  /**
   * I assume that a character can have both IMMUNITY and RESISTANCE for one type of damage at the same time.
   * but IMMUNITY always takes precedence
   */
  private calculateDamageReductions(
    damageType: DamageType,
    defenses = this.character.defenses,
    reduction = 1
  ): number {
    const [defense, ...restDefenses] = defenses;

    if (_.isEmpty(restDefenses)) {
      return reduction;
    }

    const defenseType = defense.checkResistanceTypeOnDamage(damageType);
    if (defenseType === Defense.Immunity) {
      return 0;
    }

    return this.calculateDamageReductions(
      damageType,
      restDefenses,
      defenseType === Defense.Resistance ? 0.5 : reduction
    );
  }

  private calculateDamagePointsAfterReduction(
    damageType: DamageType,
    effect: number
  ) {
    const reduction = this.calculateDamageReductions(damageType);

    return effect * reduction;
  }

  private calculateHitPointsAfterDamage(damage: number) {
    const damageAbsorbed = Math.min(this.character.temporaryHitPoints, damage);

    const calculatedTemporaryHitPoints =
      this.character.temporaryHitPoints - damageAbsorbed;
    const restOfDamage = damage - damageAbsorbed;
    const calculatedCurrentHitPoints =
      this.character.currentHitPoints - restOfDamage;

    this.character.temporaryHitPoints = calculatedTemporaryHitPoints;
    this.character.currentHitPoints = Math.max(0, calculatedCurrentHitPoints);
  }

  private ReceiveDamage({ damageType, effect }: DamagePayload) {
    if (this.isAlive) {
      const finalDamage = this.calculateDamagePointsAfterReduction(
        damageType,
        effect
      );

      this.calculateHitPointsAfterDamage(finalDamage);

      return this.event.emit(
        new ReceiveDamageEvent({
          characterName: this.character.name,
          effect: effect,
          damageDealt: finalDamage,
          hitPointsLeft: this.character.currentHitPoints,
        })
      );
    } else {
      return this.event.emit(
        new DeathEvent({
          characterName: this.character.name,
        })
      );
    }
  }

  static create(
    detailedCharacter: DetailedCharacter,
    event: DomainEvent
  ): Character {
    return new Character(event, {
      id: detailedCharacter.id,
      name: detailedCharacter.name,
      level: detailedCharacter.level,
      maxHitPoints: detailedCharacter.maxHitPoints,
      currentHitPoints: detailedCharacter.currentHitPoints,
      temporaryHitPoints: detailedCharacter.temporaryHitPoints,
      classes: detailedCharacter.classes.map(
        (characterClass) => new CharacterClass(characterClass)
      ),
      stats: new CharacterStats(detailedCharacter.stats),
      items: detailedCharacter.items.map(
        (characterItem) =>
          new CharacterItem({
            id: characterItem.id,
            name: characterItem.name,
            modifier: new ItemModifier(characterItem.modifier),
          })
      ),
      defenses: detailedCharacter.defenses.map(
        (characterDefense) => new CharacterDefense(characterDefense)
      ),
    });
  }
}

/**
 * it's tricky!
 * It would seem that the character class is an entity, but this is not true!
 * In the context of RPG games,
 * If character has a certain class (e.g. "warrior") at a certain classLevel.
 * This combination is not unique!
 * it is strongly linked to the character.
 * If two characters have the same classLevel and class,
 * the CharacterClass object is the same for both characters,
 * even if they themselves are different.
 */
export class CharacterClass {
  constructor(
    private properties: {
      name: string;
      hitDiceValue: number;
      classLevel: number;
    }
  ) {}

  toDTO() {
    return {
      name: this.properties.name,
      hitDiceValue: this.properties.hitDiceValue,
      classLevel: this.properties.classLevel,
    };
  }

  increaseLevel() {
    this.properties.classLevel = this.properties.classLevel + 1;
  }

  get name() {
    return this.properties.name;
  }

  get level() {
    return this.properties.classLevel;
  }

  get hitDiceValue() {
    return this.properties.hitDiceValue;
  }
}

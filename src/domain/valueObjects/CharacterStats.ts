export type Properties = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export class CharacterStats {
  constructor(private properties: Properties) {}

  modify(stat: keyof Properties, value: number) {
    this.properties[stat] = this.properties[stat] + value;
  }

  toDTO() {
    return {
      strength: this.properties.strength,
      dexterity: this.properties.dexterity,
      constitution: this.properties.constitution,
      intelligence: this.properties.intelligence,
      wisdom: this.properties.wisdom,
      charisma: this.properties.charisma,
    };
  }
}

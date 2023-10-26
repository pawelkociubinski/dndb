import { DamageType, Defense } from "../../common/resolvers-types.js";

interface IProperties {
  type: DamageType;
  defense: Defense;
}

export class CharacterDefense {
  private type: IProperties["type"];
  private defense: IProperties["defense"];

  constructor(properties: IProperties) {
    this.type = properties.type;
    this.defense = properties.defense;
  }

  toDTO() {
    return {
      type: this.type,
      defense: this.defense,
    };
  }

  private checkifImmune(damageType: DamageType) {
    return this.type === damageType && this.defense === Defense.Immunity;
  }

  private checkIfResistent(damageType: DamageType) {
    return this.type === damageType && this.defense === Defense.Resistance;
  }

  checkResistanceTypeOnDamage(damageType: DamageType) {
    const immunity = this.checkifImmune(damageType);
    const resistance = this.checkIfResistent(damageType);

    return immunity ? Defense.Immunity : resistance ? Defense.Resistance : null;
  }
}

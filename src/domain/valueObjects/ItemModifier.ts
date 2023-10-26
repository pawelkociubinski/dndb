export class ItemModifier {
  constructor(
    public properties: {
      affectedObject: string;
      affectedValue: string;
      value: number;
    }
  ) {}

  toDTO() {
    return {
      affectedObject: this.properties.affectedObject,
      affectedValue: this.properties.affectedValue,
      value: this.properties.value,
    };
  }
}

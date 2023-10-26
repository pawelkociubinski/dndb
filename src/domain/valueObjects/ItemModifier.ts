export class ItemModifier {
  affectedObject: string;
  affectedValue: string;
  value: number;

  constructor(affectedObject: string, affectedValue: string, value: number) {
    this.affectedObject = affectedObject;
    this.affectedValue = affectedValue;
    this.value = value;
  }
}

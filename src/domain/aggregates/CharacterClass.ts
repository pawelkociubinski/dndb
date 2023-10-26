interface Entity {
  id: string;
}

export class CharacterClass implements Entity {
  constructor(
    public id: string,
    private name: string,
    private hitDiceValue: number,
    private classLevel: number
  ) {}
}

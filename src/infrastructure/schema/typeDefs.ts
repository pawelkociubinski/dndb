export function createTypeDefs() {
  return `#graphql
  input ClassBlueprint {
    name: String!
    hitDiceValue: Int!
    classLevel: Int!
  }

  input StatsBlueprint {
    strength: Int!
    dexterity: Int!
    constitution: Int!
    intelligence: Int!
    wisdom: Int!
    charisma: Int!
  }

  input ItemModifierBlueprint {
    affectedObject: String!
    affectedValue: String!
    value: Int!
  }

  input ItemBlueprint {
    name: String!
    modifier: ItemModifierBlueprint!
  }

  input ResistanceBlueprint {
    type: DamageType!
    defense: Defense!
  }

  input CharacterBlueprint {
    name: String!
    level: Int!
    hitPoints: Int!
    classes: [ClassBlueprint!]!
    stats: StatsBlueprint!
    items: [ItemBlueprint!]!
    defenses: [ResistanceBlueprint!]!
  }

  type Class {
    name: String!
    hitDiceValue: Int!
    classLevel: Int!
  }

  type Stats {
    strength: Int!
    dexterity: Int!
    constitution: Int!
    intelligence: Int!
    wisdom: Int!
    charisma: Int!
  }

  type ItemModifier {
    affectedObject: String!
    affectedValue: String!
    value: Int!
  }

  type Item {
    id: UUID!
    name: String!
    modifier: ItemModifier! 
  }

  enum ActionType {
    DAMAGE
    HEALING
  }

  enum DamageType {
    NONE
    ACID
    BLUDGEONING
    COLD
    FIRE
    FORCE
    LIGHTNING
    NECROTIC
    PIERCING
    POISON
    PSYCHIC
    RADIANT
    SLASHING
    THUNDER
  }

  enum Defense {
    IMMUNITY
    RESISTANCE
  }

  type Resistance {
    type: DamageType!
    defense: Defense!
  }

  type Character {
    id: UUID!
    name: String!
    level: Int!
    maxHitPoints: Int!
    currentHitPoints: Int!
    temporaryHitPoints: Int!
    classes: [Class!]!
    stats: Stats!
    items: [Item!]!
    defenses: [Resistance!]!
  }

  type Spell {
    name: String!
    effect: String!
    type: ActionType!
    damageType: DamageType!
  }

  type Weapon {
    id: UUID!
    name: String!
    effect: String!
    type: ActionType!
    damageType: DamageType!
  }
  
  type Query {
    getSpells: [Spell!]!
    getWeapons: [Weapon!]!
    getCharacter(id: UUID!): Character
    getCharacters: [Character!]!
  }

  type Event {
    status: String!
    character: Character!
  }

  type Mutation {
    # According to the letter of the DDD rules, 
    # I should operate on indetifiers, 
    # but to make the API more interesting I use weapon name, spell name etc.
    makeAttack(targetName: String!, weaponName: String!): Event!
    castSpell(targetName: String!, spellName: String!): Event!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
}

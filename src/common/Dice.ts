function roll(diceType: number) {
  return Math.floor(Math.random() * diceType) + 1;
}

function calculateDamageFromExpression(damageExpression: string) {
  const regex = /(\d+)d(\d+)([+-]\d+)?/;
  const match = damageExpression.match(regex)!;

  return {
    rolls: parseInt(match[1]),
    diceType: parseInt(match[2]),
    modifier: match[3] ? parseInt(match[3]) : 0,
  };
}

export function rollDice(dice: string) {
  const { rolls, diceType, modifier } = calculateDamageFromExpression(dice);

  const finalDamage = Array.from({ length: rolls }).reduce<number>(
    (totalDamage) => {
      const rollResult = roll(diceType);
      return totalDamage + rollResult;
    },
    0
  );

  return finalDamage + modifier;
}

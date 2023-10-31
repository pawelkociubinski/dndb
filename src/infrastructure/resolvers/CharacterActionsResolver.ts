import { z } from "zod";
import {
  MutationCastSpellArgs,
  MutationMakeAttackArgs,
  MutationResolvers,
} from "../../common/resolvers-types.js";
import { GraphQLError } from "graphql";
import { CharacterActionsService } from "../../application/CharacterActionsService.js";
import { DomainEvent, IEvent } from "../../domain/events/index.js";

interface IDependancies {
  eventStore: DomainEvent;
  characterActionsService: CharacterActionsService;
}

export class CharacterActionsResolver {
  constructor(private dependancies: IDependancies) {}

  makeAttack: MutationResolvers["makeAttack"] = async (_, args) => {
    const { characterActionsService } = this.dependancies;
    const { targetName, weaponName } = args;

    this.makeAttackValidation(args);
    try {
      /**
       * I don't like this solution either.
       * However, this is a simple prototype, so I'm not building an advanced PubSub mechanism or Event Collector here
       */
      let characterDied: IEvent | undefined;
      let weaponInflictedDamage: IEvent | undefined;
      let characterReceivedDamage: IEvent | undefined;

      this.dependancies.eventStore.subscribe(
        "WEAPON_INFLICTED_DAMAGE",
        (event) => {
          console.log(event);
          weaponInflictedDamage = event;
        }
      );

      this.dependancies.eventStore.subscribe(
        "CHARACTER_RECEIVED_DAMAGE",
        (event) => {
          console.log(event);
          characterReceivedDamage = event;
        }
      );

      this.dependancies.eventStore.subscribe("CHARACTER_DIED", (event) => {
        console.log(event);
        characterDied = event;
      });

      await characterActionsService.makeAttack(weaponName, targetName);

      if (characterDied) {
        return {
          status: "dead",
          message: `${characterDied.payload.characterName} is dead`,
        };
      }

      return {
        status: "live",
        message: `${characterReceivedDamage?.payload.characterName} was attacked. The ${weaponInflictedDamage?.payload.sourceName} hit with a force of ${weaponInflictedDamage?.payload.effect} hit points. ${characterReceivedDamage?.payload.characterName} received ${characterReceivedDamage?.payload.damageDealt} damage. The character had ${characterReceivedDamage?.payload.hitPointsLeft} hit points remaining.`,
      };
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  };

  castSpell: MutationResolvers["castSpell"] = async (_, args) => {
    const { characterActionsService } = this.dependancies;
    const { targetName, spellName } = args;

    this.castSpellValidation(args);
    try {
      let characterDied: IEvent | undefined;
      let characterReceivedHealing: IEvent | undefined;
      let characterReceivedDamage: IEvent | undefined;
      let spellCasted: IEvent | undefined;

      this.dependancies.eventStore.subscribe("SPELL_CASTED", (event) => {
        console.log(event);
        spellCasted = event;
      });

      this.dependancies.eventStore.subscribe(
        "CHARACTER_RECEIVED_HEALING",
        (event) => {
          console.log(event);
          characterReceivedHealing = event;
        }
      );

      this.dependancies.eventStore.subscribe(
        "CHARACTER_RECEIVED_DAMAGE",
        (event) => {
          console.log(event);
          characterReceivedDamage = event;
        }
      );

      this.dependancies.eventStore.subscribe("CHARACTER_DIED", (event) => {
        console.log(event);
        characterDied = event;
      });

      await characterActionsService.castSpell(spellName, targetName);

      if (characterDied) {
        return {
          status: "dead",
          message: `${characterDied.payload.characterName} is dead`,
        };
      }

      if (characterReceivedDamage) {
        return {
          status: "live",
          message: `${characterReceivedDamage?.payload.characterName} was attacked. The ${spellCasted?.payload.sourceName} hit with a force of ${spellCasted?.payload.effect} hit points. ${characterReceivedDamage?.payload.characterName} received ${characterReceivedDamage?.payload.damageDealt} damage. The character now has ${characterReceivedDamage?.payload.hitPointsLeft} hit points remaining.`,
        };
      }

      if (characterReceivedHealing) {
        return {
          status: "live",
          message: `${characterReceivedHealing?.payload.targetName} was healed. The ${spellCasted?.payload.sourceName} heals with a force of ${spellCasted?.payload.effect} hit points. The character now has ${characterReceivedHealing?.payload.currentHitPoints} hit points.`,
        };
      }

      return { status: "live", message: "no effect" };
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  };

  private makeAttackValidation(args: MutationMakeAttackArgs) {
    const schema = z.object({
      targetName: z.string(),
      weaponName: z.string(),
    });

    try {
      schema.parse(args);
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  }

  private castSpellValidation(args: MutationCastSpellArgs) {
    const schema = z.object({
      targetName: z.string(),
      spellName: z.string(),
    });

    try {
      schema.parse(args);
    } catch (error) {
      throw new GraphQLError("wrong args");
    }
  }
}

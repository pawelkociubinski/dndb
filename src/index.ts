import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { CharacterFactory } from "./domain/factories/CharacterFactory.js";
import { CharacterResolver } from "./infrastructure/resolvers/CharacterResolver.js";
import { CharacterService } from "./application/CharacterService.js";
import { CharacterSQLRepositoryAdapter } from "./infrastructure/adapters/CharacterSQLRepositoryAdapter.js";
import { config } from "./infrastructure/config.js";
import { createResolvers } from "./infrastructure/schema/resolvers.js";
import { createTypeDefs } from "./infrastructure/schema/typeDefs.js";
import { loadInitialCharacter } from "./common/helpers.js";
import { Server } from "./infrastructure/server.js";
import { SQLDatabaseAdapter } from "./infrastructure/adapters/SQLDatabaseAdapter.js";
import { EquipmentResolver } from "./infrastructure/resolvers/EquipmentResolver.js";
import { SpellbookResolver } from "./infrastructure/resolvers/SpellbookResolver.js";
import { CharacterActionsResolver } from "./infrastructure/resolvers/CharacterActionsResolver.js";
import { EquipmentService } from "./application/EquipmentService.js";
import { EquipmentSQLRepositoryAdapter } from "./infrastructure/adapters/EquipmentSQLRepositoryAdapter.js";
import { EquipmentFactory } from "./domain/factories/EquipmentFactory.js";
import { SpellbookService } from "./application/SpellbookService.js";
import { SpellFactory } from "./domain/factories/SpellFactory.js";
import { SpellbookSQLRepositoryAdapter } from "./infrastructure/adapters/SpellbookSQLRepositoryAdapter.js";
import { InMemorEventStoreAdapter } from "./infrastructure/adapters/InMemoryEventStoreAdapter.js";
import { CharacterActionsService } from "./application/CharacterActionsService.js";

const database = new SQLDatabaseAdapter();
const eventStore = new InMemorEventStoreAdapter();

const characterFactory = new CharacterFactory({ eventStore });
const characterRepository = new CharacterSQLRepositoryAdapter({
  characterFactory,
  database,
});
const characterService = new CharacterService({ characterRepository });
const characterResolver = new CharacterResolver({ characterService });

const equipmentFactory = new EquipmentFactory({ eventStore });
const equipmentRepository = new EquipmentSQLRepositoryAdapter({
  equipmentFactory,
  database,
});
const equipmentService = new EquipmentService({ equipmentRepository });
const equipmentResolver = new EquipmentResolver({ equipmentService });

const spellFactory = new SpellFactory({ eventStore });
const spellbookRepository = new SpellbookSQLRepositoryAdapter({
  spellFactory,
  database,
});
const spellbookService = new SpellbookService({ spellbookRepository });
const spellbookResolver = new SpellbookResolver({ spellbookService });

const characterActionsService = new CharacterActionsService({
  equipmentRepository,
  characterRepository,
  spellbookRepository,
});

const characterActionsResolver = new CharacterActionsResolver({
  characterActionsService,
  eventStore,
});

const typeDefs = createTypeDefs();
const resolvers = createResolvers({
  characterActionsResolver,
  characterResolver,
  equipmentResolver,
  spellbookResolver,
});
const schema = makeExecutableSchema({
  typeDefs: [scalarTypeDefs, typeDefs],
  resolvers,
});

const server = new Server({ schema });
await server.listen({ port: config.PORT }, async () => {
  /**
   * I could have added this character from the migration level,
   * but I wasn't sure if such a solution would be expected.
   * I would treat the code below as a backdoor for local tests, not as production code.
   */
  void loadInitialCharacter({
    characterService,
    database,
  });
});

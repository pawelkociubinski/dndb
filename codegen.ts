import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",

  generates: {
    "./src/common/resolvers-types.ts": {
      config: {
        useIndexSignature: true,
        scalars: {
          UUID: "string",
        },
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;

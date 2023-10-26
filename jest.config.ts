import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    extensionsToTreatAsEsm: [".ts"],
    transform: {
      // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
      // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
      "^.+\\.ts?$": [
        "ts-jest",
        {
          useESM: true,
        },
      ],
    },
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    coverageDirectory: "coverage",
    reporters: ["default"],
    testEnvironment: "node",
    verbose: true,
  };
};

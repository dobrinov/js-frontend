import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:8080/graph": {
        headers: { Authorization: process.env.TOKEN ?? "?" },
      },
    },
  ],
  documents: ["src/**/*.ts", "src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql/types.ts": {
      plugins: [
        {
          add: {
            content: "/* eslint-disable */",
          },
        },
        "typescript",
        "typescript-operations",
      ],
      config: {
        addUnderscoreToArgsType: true,
        dedupeOperationSuffix: true,
        defaultScalarType: "string",
        namingConvention: {
          typeNames: "change-case#pascalCase",
          enumValues: "change-case#upperCase",
        },
        avoidOptionals: true,
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        documentVariableSuffix: "",
        flattenGeneratedTypes: true,
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;

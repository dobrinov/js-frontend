import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:8080/graph": {
        headers: { Authorization: process.env.TOKEN ?? "?" },
      },
    },
  ],
  ignoreNoDocuments: true,
  generates: {
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
    "./src/graphql/types.ts": {
      documents: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.generated.ts"],
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
    "./src/": {
      documents: ["!schema.graphql", "**/*.graphql"],
      preset: "near-operation-file",
      plugins: [
        {
          add: {
            content: "/* eslint-disable */",
          },
        },
        "typescript-operations",
        "typed-document-node",
      ],
      presetConfig: {
        baseTypesPath: "types.ts",
        extension: ".generated.ts",
      },
      config: {
        avoidOptionals: { field: true },
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        dedupeOperationSuffix: true,
        fragmentVariableSuffix: "Fragment",
        documentVariableSuffix: "",
        optimizeDocumentNode: false,
        documentMode: "graphQLTag",
      },
    },
  },
};

export default config;

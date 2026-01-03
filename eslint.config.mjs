import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Disallow console statements
      "no-console": "error",
      // Disallow debugger statements
      "no-debugger": "error",
      // Disallow unused variables
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      // Disallow empty functions
      "@typescript-eslint/no-empty-function": "error",
      // Disallow any type assertions
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
]);

export default eslintConfig;

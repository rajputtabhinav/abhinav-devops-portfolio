import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "Kelly-1.0.0/**",
    "next-env.d.ts",
    "node_modules/**",
    "public/assets/vendor/**",
  ]),
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-css-tags": "off",
    },
  },
]);

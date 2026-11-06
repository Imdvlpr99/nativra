import baseConfig from "./packages/config/eslint.js";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/.turbo/**",
      "apps/native-preview/**",
      "examples/**",
      "registry/**",
    ],
  },
  ...baseConfig,
];


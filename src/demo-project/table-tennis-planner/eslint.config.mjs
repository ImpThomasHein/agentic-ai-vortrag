// ESLint 9 flat config for Next.js with Storybook support
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  { ignores: [".next/", ".worktrees/", "node_modules/", "lib/generated/"] },
  ...compat.extends("next/core-web-vitals", "plugin:storybook/recommended"),
];

export default eslintConfig;

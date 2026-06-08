import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // eslint-config-next 16 bundles eslint-plugin-react-hooks v6, which adds the
    // React Compiler rules below as errors. They flag pre-existing, working
    // patterns carried over from the 2025 app, so keep them as warnings for now.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
    },
  },
];

export default eslintConfig;

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "plugin:@next/next/recommended",
    "next/core-web-vitals",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      env: { browser: true, es6: true, node: true },
      globals: { Atomics: "readonly", SharedArrayBuffer: "readonly" },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2018,
        sourceType: "module",
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      plugins: ["@typescript-eslint"],
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "react/require-default-props": "off",
    "react/jsx-filename-extension": [2, { extensions: [".jsx", ".tsx"] }],
    "no-unused-vars": ["error", { args: "none" }],
    semi: ["error", "always"],
    quotes: ["error", "double"],
    camelcase: "off",
    "react/jsx-props-no-spreading": "off",
    "react/prop-types": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "linebreak-style": ["off"],
  },
};

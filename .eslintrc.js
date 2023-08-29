module.exports = {
  env: {
    browser: true,

    es2021: true,
  },

  extends: ["plugin:react/recommended", "airbnb", "plugin:prettier/recommended"],

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },

    ecmaVersion: 2020,

    sourceType: "module",
  },

  plugins: ["react", "only-warn"],

  rules: {
    "react/function-component-definition": "off",

    "jsx-a11y/click-events-have-key-events": "off",

    "jsx-a11y/no-noninteractive-element-interactions": "off",

    "react/jsx-filename-extension": "off",

    "react/prop-types": 0,

    "no-underscore-dangle": "off",

    "no-nested-ternary": "off",

    "no-param-reassign": ["error", { props: false }],

    "jsx-a11y/no-static-element-interactions": "off",

    "linebreak-style": 0,

    "no-console": "off",

    "react/jsx-no-useless-fragment": "off",

    radix: "off",

    "react/jsx-props-no-spreading": "off",

    camelcase: "off",

    "react/jsx-no-bind": "off",

    "jsx-a11y/anchor-is-valid": "off",

    "jsx-a11y/control-has-associated-label": "off",

    "jsx-a11y/label-has-associated-control": "off",

    "class-methods-use-this": "off",

    "prefer-regex-literals": "off",

    "react/destructuring-assignment": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};

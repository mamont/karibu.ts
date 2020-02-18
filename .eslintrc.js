module.exports = {
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "extends": [
        //"airbnb",
        'plugin:@typescript-eslint/recommended'
    ],
    "rules": {
        indent: ['error', 4],
        "import/prefer-default-export": "off",
        "no-restricted-syntax": "off",
    }
};

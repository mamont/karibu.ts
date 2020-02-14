module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/indent": [
            "error",
            4,
            {
                "FunctionDeclaration": {
                    "parameters": "first"
                },
                "FunctionExpression": {
                    "parameters": "first"
                }
            }
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "none",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            null
        ],
        "@typescript-eslint/type-annotation-spacing": "error",
        "curly": "error",
        "eol-last": "off",
        "max-len": [
            "error",
            {
                "code": 150
            }
        ],
        "no-multiple-empty-lines": "error",
        "no-redeclare": "error",
        "no-trailing-spaces": "error",
        "no-var": "error",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "one-line": [
                        true,
                        "check-else",
                        "check-whitespace",
                        "check-open-brace"
                    ],
                    "whitespace": [
                        true,
                        "check-branch",
                        "check-decl",
                        "check-operator",
                        "check-separator",
                        "check-type"
                    ]
                }
            }
        ]
    }
};

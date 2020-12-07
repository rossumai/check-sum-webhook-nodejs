module.exports = {
    "env": {
        "node": true,
	"mocha": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "prefer-destructuring": ["error", {
            "array": true,
            "object": true
        }, {
            "enforceForRenamedProperties": false
        }],
        "no-param-reassign": "error",
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};

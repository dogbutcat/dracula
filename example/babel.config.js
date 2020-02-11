module.exports = {
    "presets": ["@babel/preset-react", "@babel/preset-env"],
    "plugins": [
        "@babel/plugin-proposal-class-properties", // for static property transform
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        "@babel/plugin-proposal-json-strings",
        [
            "import",
            {
                "libraryName": "antd",
                "style": true
            }
        ]
    ],
    "env": {
        "development": {
            "plugins": ["react-hot-loader/babel"]
        }
    }
}
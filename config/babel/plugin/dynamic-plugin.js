/**
 * Test here: {@link https://astexplorer.net/}
 */
const syntaxDynamicImport = require("@babel/plugin-syntax-dynamic-import");

module.exports = function(babel) {
    let { types: t, template } = babel;

    function isValidIdentifier(path) {
        return path.get("callee").isIdentifier({ name: "DynamicWrapper" });
    }

    return {
        visitor: {
            CallExpression(path, state) {
                // https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#%E5%81%9C%E6%AD%A2%E9%81%8D%E5%8E%86
                if (!isValidIdentifier(path)) return;

                // first arg is string
                let firstArg = path.get("arguments")[0];
                if (!firstArg.isStringLiteral()) return; // is literal

                // DynamicWrapper("./ui/index", () => import( /* webpackChunkName: "welcome" */  "./ui/index.js"))
                // ->
                // DynamicWrapper(require.resolveWeak("./ui/index"), () => import( /* webpackChunkName: "welcome" */  "./ui/index.js"))
                let firstArgValue = firstArg.node.value;
                let resolveString = "resolveWeak";
                if(process.env.NODE_ENV==='development'){
                    resolveString = "resolve";
                }
                path.get("arguments")[0].replaceWith(
                    t.callExpression(
                        t.memberExpression(
                            t.identifier("require"),
                            t.identifier(resolveString)
                        ),
                        [t.stringLiteral(firstArgValue)]
                    )
                );
            },
            Program(path, state){
                // append 
                if(process.env.NODE_ENV!=='development') return;
                const hotAccept = template.ast(`
                    if(module.hot){
                        module.hot.accept();
                    }
                `)
                path.pushContainer('body', hotAccept);
            }
        }
    };
};

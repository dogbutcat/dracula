/**
 * for quokka.js test
 */
// json with pkg
let pkgJson = {"name":"testPkg","description":"testPkg","version":"1.0.0","private":true,"scripts":{"start":"demon debug server","build":"demon release","server":"demon","gray-build":"cross-env NODE_ENV=gray demon release server","test-build":"cross-env NODE_ENV=test demon release","debug":"demon debug","test":"jest --watch"},"devDependencies":{"@babel/core":"^7.0.0","@babel/plugin-proposal-class-properties":"^7.0.0","@babel/plugin-proposal-json-strings":"^7.0.0","@babel/plugin-syntax-dynamic-import":"^7.0.0","@babel/plugin-syntax-import-meta":"^7.0.0","@babel/polyfill":"^7.0.0","@babel/preset-env":"^7.0.0","@babel/preset-react":"^7.0.0","@hot-loader/react-dom":"16.8.6","antd":"3.20.3","autoprefixer":"^9.5.1","babel-core":"^7.0.0-bridge.0","babel-eslint":"^9.0.0","babel-jest":"^23.4.2","babel-loader":"^8.0.0","babel-plugin-import":"^1.1.1","babel-preset-react-hmre":"^1.1.1","clean-webpack-plugin":"^2.0.2","compression-webpack-plugin":"^1.1.12","console-polyfill":"^0.3.0","cross-env":"^5.2.0","crypto-js":"^3.1.9-1","css-loader":"^2.1.1","css-split-webpack-plugin":"^0.2.6","cz-conventional-changelog":"^2.1.0","es3ify-loader":"^0.2.0","es3ify-webpack-plugin":"^0.1.0","es5-shim":"^4.5.13","eslint":"^5.16.0","eslint-plugin-babel":"^5.3.0","eslint-plugin-react":"^7.13.0","eventsource-polyfill":"^0.9.6","file-loader":"^3.0.1","fingerprintjs":"^0.5.3","highcharts":"~7.1.2","highcharts-react-official":"~2.2.2","html-webpack-plugin":"3.2.0","jest":"^24.8.0","less":"^3.9.0","less-loader":"^5.0.0","mini-css-extract-plugin":"^0.6.0","postcss-loader":"^3.0.0","postcss-modules-values":"^3.0.0","react":"16.8.6","react-dom":"16.8.6","react-hot-loader":"^4.12.6","react-router":"4.3.1","react-router-dom":"4.3.1","style-loader":"^0.23.1","uglifyjs-webpack-plugin":"^2.1.3","url-loader":"^1.1.2","webpack":"^4.32.2","webpack-bundle-analyzer":"^3.3.2","webpack-dev-middleware":"^3.7.0","webpack-hot-middleware":"^2.25.0"},"dependencies":{"axios":"^0.18.0","body-parser":"^1.19.0","chokidar":"^3.0.0","compression":"^1.7.4","connect-multiparty":"^2.2.0","cookie-parser":"^1.4.4","debug":"^4.1.1","express":"^4.17.0","express-handlebars":"^3.1.0","md5":"^2.2.1","moment":"^2.24.0","morgan":"^1.9.1","qiniu":"^7.1.1","request":"^2.88.0","rimraf":"^2.6.3","serve-favicon":"^2.5.0","uuid":"^3.1.0"},"author":{"name":"oliver"},"license":"ISC","jest":{"moduleNameMapper":{"@proj/(.*)$":"<rootDir>/src/$1"}}}
// json without pkg
pkgJson = {"name":"testPkg","description":"testPkg","version":"1.0.0","private":true,"scripts":{"start":"demon debug server","build":"demon release","server":"demon","gray-build":"cross-env NODE_ENV=gray demon release server","test-build":"cross-env NODE_ENV=test demon release","debug":"demon debug","test":"jest --watch"},"devDependencies":{"@babel/core":"^7.0.0","@babel/plugin-proposal-class-properties":"^7.0.0","@babel/plugin-proposal-json-strings":"^7.0.0","@babel/plugin-syntax-dynamic-import":"^7.0.0","@babel/plugin-syntax-import-meta":"^7.0.0","@babel/polyfill":"^7.0.0","@babel/preset-env":"^7.0.0","@babel/preset-react":"^7.0.0","@hot-loader/react-dom":"16.8.6","animated":"^0.2.2","antd":"3.20.3","autoprefixer":"^9.5.1","babel-core":"^7.0.0-bridge.0","babel-eslint":"^9.0.0","babel-jest":"^23.4.2","babel-loader":"^8.0.0","babel-plugin-import":"^1.1.1","babel-preset-react-hmre":"^1.1.1","clean-webpack-plugin":"^2.0.2","compression-webpack-plugin":"^1.1.12","console-polyfill":"^0.3.0","cross-env":"^5.2.0","crypto-js":"^3.1.9-1","css-loader":"^2.1.1","css-split-webpack-plugin":"^0.2.6","cz-conventional-changelog":"^2.1.0","es3ify-loader":"^0.2.0","es3ify-webpack-plugin":"^0.1.0","es5-shim":"^4.5.13","eslint":"^5.16.0","eslint-plugin-babel":"^5.3.0","eslint-plugin-react":"^7.13.0","eventsource-polyfill":"^0.9.6","file-loader":"^3.0.1","fingerprintjs":"^0.5.3","highcharts":"~7.1.2","highcharts-react-official":"~2.2.2","html-webpack-plugin":"3.2.0","jest":"^24.8.0","less":"^3.9.0","less-loader":"^5.0.0","mini-css-extract-plugin":"^0.6.0","postcss-loader":"^3.0.0","postcss-modules-values":"^3.0.0","react":"16.8.6","react-dom":"16.8.6","react-hot-loader":"^4.12.6","react-router":"4.3.1","react-router-dom":"4.3.1","style-loader":"^0.23.1","uglifyjs-webpack-plugin":"^2.1.3","url-loader":"^1.1.2","webpack":"^4.32.2","webpack-bundle-analyzer":"^3.3.2","webpack-dev-middleware":"^3.7.0","webpack-hot-middleware":"^2.25.0"},"dependencies":{"axios":"^0.18.0","body-parser":"^1.19.0","chokidar":"^3.0.0","compression":"^1.7.4","connect-multiparty":"^2.2.0","cookie-parser":"^1.4.4","debug":"^4.1.1","express":"^4.17.0","express-handlebars":"^3.1.0","md5":"^2.2.1","moment":"^2.24.0","morgan":"^1.9.1","qiniu":"^7.1.1","request":"^2.88.0","rimraf":"^2.6.3","serve-favicon":"^2.5.0","uuid":"^3.1.0"},"author":{"name":"oliver"},"license":"ISC","jest":{"moduleNameMapper":{"@proj/(.*)$":"<rootDir>/src/$1"}}}
function isNpmPkg(pkgName, options) {
    let ret = false,
        pkgInJson = false,
        searchPkg = pkgName, // used to search
        fullPkg; // used to install
    if (/^\./.test(searchPkg)) {
        // module name like './a.js' is not a npm package
        ret = false;
    }
    // const pkgJson = require(path.resolve(getProjectDir(), "./package.json"));

    if ("devDependencies" in pkgJson) {
        let filteredPkgs = Object.keys(pkgJson.devDependencies).filter(
            pkg => searchPkg.indexOf(pkg) == 0
        );
        if (filteredPkgs.length > 0) {
            // found missing package in filtered package
            // use first one
            let pkgVersion = pkgJson.devDependencies[filteredPkgs[0]].replace(
                /[\^\~]/,
                ""
            );
            searchPkg = filteredPkgs[0];
            fullPkg = filteredPkgs[0] + "@" + pkgVersion;
            pkgInJson = true;
        }
    }

    if (!pkgInJson) {
        // not found package in package.json
        let splitedPkgNames = searchPkg.split("/");
        searchPkg = splitedPkgNames[0];
        if (searchPkg.indexOf("@") === 0) {
            // start with `@`, permit one more `/`
            searchPkg += "/" + splitedPkgNames[1];
        }
        fullPkg = searchPkg;
    }

    // if (fetchRemotePkg(searchPkg)) {
        ret = fullPkg;
    // }
    return ret;
}


let pkg = 'animated/lib/target/react-dom';
pkg = '@babel/core'
isNpmPkg(pkg) /*? */
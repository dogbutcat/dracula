/**
 * refer from @loadable/webpack-plugin
 */

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

const nodePath = require("path");

const fs = require("fs");

const mkdirp = require("mkdirp");

class ManifestPlugin {
    constructor({ filename = "../../build/manifest.json", path, writeToDisk, outputAsset = true } = {}) {
        _defineProperty(this, "handleEmit", (hookCompiler, callback) => {
            const stats = hookCompiler.getStats().toJson({
                hash: true,
                publicPath: true,
                outputPath: false,
                assets: true,
                chunks: false,
                modules: false,
                source: false,
                errorDetails: false,
                timings: false
            });
            const result = JSON.stringify(stats, null, 2);

            if (this.opts.outputAsset) {
                hookCompiler.assets[this.opts.filename] = {
                    source() {
                        return result;
                    },

                    size() {
                        return result.length;
                    }
                };
            }

            if (this.opts.writeToDisk) {
                this.writeAssetsFile(result);
            }

            callback();
        });

        _defineProperty(this, "writeAssetsFile", manifest => {
            const outputFolder = this.opts.writeToDisk.filename || this.compiler.options.output.path;
            const outputFile = nodePath.resolve(outputFolder, this.opts.filename);

            try {
                if (!fs.existsSync(outputFolder)) {
                    mkdirp.sync(outputFolder);
                }
            } catch (err) {
                if (err.code !== "EEXIST") {
                    throw err;
                }
            }

            fs.writeFileSync(outputFile, manifest);
        });

        this.opts = {
            filename,
            writeToDisk,
            outputAsset,
            path
        }; // The Webpack compiler instance

        this.compiler = null;
    }

    apply(compiler) {
        this.compiler = compiler; // Add a custom output.jsonpFunction: __LOADABLE_LOADED_CHUNKS__

        // this relate with chunkReady function check array,
        // now use default webpackJsonp
        // compiler.options.output.jsonpFunction = '__LOADABLE_LOADED_CHUNKS__';

        if (this.opts.outputAsset || this.opts.writeToDisk) {
            compiler.hooks.emit.tapAsync("ManifestJsonPlugin", this.handleEmit);
        }
    }
}

module.exports = ManifestPlugin;

/**
 * reference from
 * https://github.com/gregberge/loadable-components/blob/master/packages/server/src/ChunkExtractor.js
 */

const React = require('react'),
      path = require('path'),
      fs = require('fs'),
      uniq = require('lodash/uniq'),
      uniqBy = require('lodash/uniqBy'),
      flatMap = require('lodash/flatMap');
var Context = require('../../../api/Context').default;

const EXTENSION_SCRIPT_TYPES = {
  '.js': 'script',
  '.css': 'style'
};

function extensionToScriptType(extension) {
  return EXTENSION_SCRIPT_TYPES[extension] || null;
}

function isValidChunkAsset(chunkAsset) {
  return chunkAsset.scriptType;
}

const joinURLPath = (publicPath, filename) => {
  if (publicPath.substr(-1) === '/') {
    return `${publicPath}${filename}`
  }

  return `${publicPath}/${filename}`
}

function getSriHtmlAttributes(asset) {
  if (!asset.integrity) {
    return '';
  }

  return ` integrity="${asset.integrity}"`;
}

function assetToScriptTag(asset, extraProps) {
  return `<script async data-chunk="${asset.chunk}" src="${asset.url}"${getSriHtmlAttributes(asset)}></script>`;
}

function assetToStyleTag(asset, extraProps) {
  return `<link data-chunk="${asset.chunk}" rel="stylesheet" href="${asset.url}"${getSriHtmlAttributes(asset)}>`;
}

function joinTags(tags) {
  return tags.join('\n');
}

function getAssets(chunks, getAsset) {
  return uniqBy(flatMap(chunks, chunk => getAsset(chunk)), 'url');
}

class ChunkController{
    constructor({
        statsFile,
        stats,
        entrypoints = [], // entrypoint in hbs
        // namespace = '',
        outputPath,
        publicPath,
        inputFileSystem = fs,
      } = {}) {
        // this.namespace = namespace
        this.stats = stats || eval('require')(statsFile) // use eval for avoid webpack pack up
        this.publicPath = publicPath || this.stats.publicPath
        this.outputPath = outputPath || this.stats.outputPath
        this.statsFile = statsFile
        this.entrypoints = Array.isArray(entrypoints) ? entrypoints : [entrypoints]
        this.chunks = []
        this.inputFileSystem = inputFileSystem
      }

    addChunk(chunk){
        this.chunks.push(chunk);
    }

    chunkContext(app){
        return React.createElement(Context.Provider, {
            value: this
          }, app);
    }


    /**
     * Copy parts
     */
    getChunkDependencies(chunks) {
      const one = chunk => {
        const chunkGroup = this.getChunkGroup(chunk);
        return chunkGroup.chunks;
      };
  
      if (Array.isArray(chunks)) {
        return uniq(flatMap(chunks, one));
      }
  
      return one(chunks);
    }

    getRequiredChunksScriptContent() {
      return JSON.stringify(this.getChunkDependencies(this.chunks));
    }

    getRequiredChunksScriptTag(extraProps) {
      return `<script id="__CHUNKS__" type="application/json">${this.getRequiredChunksScriptContent()}</script>`;
    }

    getChunkGroup(chunk) {
      const chunkGroup = this.stats.namedChunkGroups[chunk];
      return chunkGroup;
    }

    resolvePublicUrl(filename) {
      return joinURLPath(this.publicPath, filename);
    }

    createChunkAsset({
      filename,
      chunk,
      type,
      linkType
    }) {
      return {
        filename,
        scriptType: extensionToScriptType(path.extname(filename).split('?')[0].toLowerCase()),
        chunk,
        url: this.resolvePublicUrl(filename),
        // path: path.join(this.outputPath, filename),
        type,
        linkType
      };
    }

    getChunkAssets(chunks) {
      const one = chunk => {
        const chunkGroup = this.getChunkGroup(chunk);
        return chunkGroup.assets.map(filename => this.createChunkAsset({
          filename,
          chunk,
          type: 'mainAsset',
          linkType: 'preload'
        })).filter(isValidChunkAsset);
      };
  
      if (Array.isArray(chunks)) {
        return getAssets(chunks, one);
      }
  
      return one(chunks);
    }

    getMainAssets(scriptType) {
      const chunks = [...this.entrypoints, ...this.chunks];
      const assets = this.getChunkAssets(chunks);
  
      if (scriptType) {
        return assets.filter(asset => asset.scriptType === scriptType);
      }
  
      return assets;
    }

    getScriptTags(extraProps = {}) {
      const requiredScriptTag = this.getRequiredChunksScriptTag(extraProps);
      const mainAssets = this.getMainAssets('script');
      const assetsScriptTags = mainAssets.map(asset => assetToScriptTag(asset, extraProps));
      return joinTags([requiredScriptTag, ...assetsScriptTags]);
    }


    getStyleTags(extraProps = {}) {
      const mainAssets = this.getMainAssets('style');
      return joinTags(mainAssets.map(asset => assetToStyleTag(asset, extraProps)));
    }

    // getLinkTags(extraProps = {}) {
    //   const assets = this.getPreAssets();
    //   const linkTags = assets.map(asset => assetToLinkTag(asset, extraProps));
    //   return joinTags(linkTags);
    // }
}

module.exports = ChunkController;
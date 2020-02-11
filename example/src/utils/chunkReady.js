/**
 * Refer from @loadable/component - loadableReady
 * only usable in browser
 */

export function chunkReady(done, _temp) {
    if (done === void 0) {
      done = function done() {};
    }

    var requiredChunks = [];

    var dataElement = document.getElementById("__CHUNKS__");

    if (dataElement) {
        try {
            requiredChunks = JSON.parse(dataElement.textContent);
        } catch (error) {
        }
    }

    var resolved = false;
    return new Promise(function (resolve) {
      window.webpackJsonp = window.webpackJsonp || [];
      var loadedChunks = window.webpackJsonp;
      var originalPush = loadedChunks.push.bind(loadedChunks);

      function checkReadyState() {
        if (requiredChunks.every(function (chunk) {
          return loadedChunks.some(function (_ref2) {
            var chunks = _ref2[0];
            return chunks.indexOf(chunk) > -1;
          });
        })) {
          if (!resolved) {
            resolved = true;
            resolve();
            done();
          }
        }
      }

      loadedChunks.push = function () {
        originalPush.apply(void 0, arguments);
        checkReadyState();
      };

      checkReadyState();
    });
  }
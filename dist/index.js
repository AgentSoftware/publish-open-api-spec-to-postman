/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 396:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 778:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ }),

/***/ 703:
/***/ ((module) => {

module.exports = eval("require")("openapi-to-postmanv2");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const fs = __nccwpck_require__(147);
const converter = __nccwpck_require__(703);
const axios = __nccwpck_require__(778);
const core= __nccwpck_require__(396);

const getSpecFromUrl = async (url) => {
  const data = await axios.get(url);
  return data.data;
}

const getSpecFromFile = (path) => {
  return fs.readFileSync(path, {encoding: 'UTF8'});
}

const convertToPostman = async (openapiData) => {

  return new Promise((resolve, reject) => {
    converter.convert({ type: 'string', data: openapiData },
      {}, (err, conversionResult) => {
        if(err || 
          !conversionResult.result || 
          !conversionResult.output || 
          conversionResult.output.length == 0 ||
          !conversionResult.output[0].data) {
              if(conversionResult.reason) {
                return reject('Could not convert', conversionResult.reason);
              }
              return reject('Something went wrong');
            } else {
              const collection = {collection: conversionResult.output[0].data};
              return resolve(collection);
            }
      });
  });
}

const publish = async (postmanCollectionId, postmanCollection, postmanApiKey) => {
  return await axios.put(`https://api.getpostman.com/collections/${postmanCollectionId}?apikey=${postmanApiKey}`, postmanCollection);
}

const update = async () => {

  try {
    const postmanApiKey = core.getInput('postmanApiKey');
    const postmanCollectionId = core.getInput('postmanCollectionId');
    const openApiSpec = core.getInput('openApiSpec');

    const isUrl = (openApiSpec.startsWith("https") || openApiSpec.startsWith("http"));
    const openapiData = isUrl ? await getSpecFromUrl(openApiSpec) : getSpecFromFile(openApiSpec);
    const postmanCollection = await convertToPostman(openapiData);

    await publish(postmanCollectionId, postmanCollection, postmanApiKey);
  } catch (e) {
    console.log(e)
    core.setFailed(e.message);
  }
}

update();


})();

module.exports = __webpack_exports__;
/******/ })()
;
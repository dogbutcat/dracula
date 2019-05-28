let createRoute = (setting) => {
    var express = require('express'),
        router = express.Router(),
        ApiRoute = require('./ApiRoute'),
        IndexRoute = require(setting.ssr ? 
            '../../../../build/server.js' :
            './IndexRoute');
    router.use('/api', new ApiRoute(setting).getRoute());
    // mountRoute(router, setting);
    let indexRoute = new IndexRoute(setting).getRoute();
    router.use('/web/*', indexRoute);
    router.use('/*', indexRoute);
    return router;
};

// function mountRoute(router, setting) {
//     // let { qiniu } = setting;
//     // if (qiniu && qiniu.accessKey && qiniu.secretKey && qiniu.domain && qiniu.bucket) {
//     let UploadRoute = require('./UploadRoute');
//     router.use('/cloudfile/upload', new UploadRoute(setting).getRoute());
//     // }
// }

module.exports = createRoute;

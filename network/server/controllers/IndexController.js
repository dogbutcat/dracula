let path = require("path"),
    { getProjectDir } = require("../../../api/ApiTool"),
    { get } = require("lodash"),
    Main = null,
    App = null,
    manifestPath = path.resolve(getProjectDir(), "./build/manifest.json"),
    ChunkController,
    BaseController = require("./BaseController");

// this is to pack up react-router
try {
    var React = require("react"),
        { renderToString } = require("react-dom/server"),
        // { renderRoutes, matchRoutes } = require("react-router-config"),
        { StaticRouter, matchPath } = require("react-router");

    Main = require("../../../../../src/routes.js").default;
    App = require("../../../../../src/main/App").default;
} catch (error) {
    Main = []; // react router 4 would need to be array
}

class IndexController extends BaseController {
    constructor(setting) {
        super(setting);
    }

    /**
     * route item changed
     * {
     *   path: "/",
     *   exact: true,
     *   title: "Index"
     *   component: DynamicWrapper(
     *       "./main/index/Index.js",
     *       () => import("./main/index/Index.js")
     *   ),
     *   extra: {
     *       layout: DefaultLayout,
     *       conditional: false
     *   }
     * }
     * @param {*} path
     * @param {*} routeArr
     */
    routerReducer(path, routeArr) {
        let ret = null;
        routeArr.forEach(routeItem => {
            let route = this.buildRouteObj(routeItem);
            if (!ret) {
                if (route.routes) {
                    ret = this.routerReducer(path, route.routes);
                } else if (!route.path) {
                    ret = null;
                } else {
                    let matchResult = matchPath(path, route);
                    if (matchResult) {
                        ret = [route, matchResult];
                    }
                }
            }
        });
        return ret;
    }

    buildRouteObj(routeItem) {
        // return {
        //     ...routeItem.router,
        //     component:routeItem.component,
        // }
        return routeItem;
    }

    serverRender(req, res, next) {
        try {
            ChunkController = require("./ChunkController");
            let chunkController = new ChunkController({ statsFile: this.Setting.manifestPath || manifestPath });

            let reqUrl = req.originalUrl.split("?")[0],
                reqOption = {},
                targetUrl = this.getHost();

            let renderProps = this.routerReducer(reqUrl, Main);

            if (renderProps) {
                let [target, matchResult] = renderProps,
                    routerContext = { __initData__: null };

                /**
                 * routeItem: self defined routeItem.
                 * matchResult:
                 *  {
                 *      isExact: true,
                 *      params: {},
                 *      path: "/this/is/:path",
                 *      url:"/this/is/url"
                 *  }
                 */
                reqOption = {
                    routeItem: target, // found route to change some data like title
                    matchResult
                };

                let requestInitialData =
                    target.requestInitialData && target.requestInitialData(req.query, targetUrl, reqOption);

                Promise.resolve(requestInitialData)
                    .then(data => {
                        this.createLog("Success!!!!!");
                        routerContext = { __initData__: data || null };
                        return Promise.resolve(routerContext);
                    })
                    .then(context => {
                        var body = renderToString(
                            chunkController.chunkContext(
                                React.createElement(
                                    StaticRouter,
                                    { location: req.originalUrl, context: context },
                                    React.createElement(App)
                                )
                            )
                        );
                        if (context.url) {
                            // Somewhere a `<Redirect>` was rendered
                            redirect(301, context.url);
                        } else {
                            // we're good, send the response
                            res.status(200).render("index", {
                                isSSR: true,
                                content: body,
                                _title: target.title,
                                _metadata: get(target, "extra.metadata"),
                                _styles: chunkController.getStyleTags(),
                                _scripts: chunkController.getScriptTags(),
                                __initData__: JSON.stringify(context.__initData__)
                            });
                        }
                    })
                    .catch(e => {
                        console.log("[ServerRendering Failed]: " + e);
                        console.log(e.stack);
                        next(e);
                    });
            } else {
                next();
            }
        } catch (error) {
            console.log("[Internal Error]: " + error);
            console.log("[Internal Error]: " + error.stack);
            next(error);
        }
    }

    renderPage(req, res, next) {
        let { ssr, DEV, title } = this.Setting;
        if (ssr) {
            this.serverRender(req, res, next);
        } else {
            res.render("index", {
                isSSR: ssr,
                isDEV: DEV,
                _title: title
            });
        }
    }

    mainEntry() {
        return (req, res, next) => {
            let userAgent = req.headers["user-agent"],
                browserSupport = this.Setting.browserSupport || 0,
                blockPageName = path.resolve(
                    getProjectDir(),
                    this.Setting.assetPath,
                    this.Setting.blockPageName || "index.html"
                ),
                ieReg = null;
            if (!userAgent) {
                res.send("Oh! Where Are You From? Σ(￣。￣ﾉ)ﾉ");
            } else if (browserSupport) {
                if (("" + browserSupport).match(/[5-9]|1[01]/)) {
                    ieReg = userAgent.match(/msie\s(\d+)\./i);
                    ieReg && ieReg[1] < browserSupport ? res.sendFile(blockPageName) : this.renderPage(req, res, next);
                } else {
                    this.renderPage(req, res, next);
                }
            } else {
                this.renderPage(req, res, next);
            }
        };
    }
}

module.exports = IndexController;

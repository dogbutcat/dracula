let path = require("path"),
    { getProjectDir } = require("../../../api/ApiTool"),
    Main = null,
    App = null,
    BaseController = require("./BaseController");

// this is to pack up react-router
try {
    var merge = require("lodash/merge"),
        React = require("react"),
        { renderToString } = require("react-dom/server"),
        // { renderRoutes, matchRoutes } = require("react-router-config"),
        { StaticRouter, matchPath } = require("react-router");

    Main = require("../../../../src/routes.js").default;
    App = require("../../../../src/main/App").default;
} catch (error) {
    Main = []; // react router 4 would need to be array
}

class IndexController extends BaseController {
    constructor(setting) {
        super(setting);
    }

    routerReducer(path, routeArr) {
        let ret = null;
        routeArr.forEach(route => {
            if (!ret) {
                if (route.routes) {
                    ret = this.routerReducer(path, route.routes);
                } else if (!route.path) {
                    ret = null;
                } else {
                    if (matchPath(path, route)) {
                        ret = route;
                    }
                }
            }
        });
        return ret;
    }

    serverRender(req, res, next) {
        try {
            let reqUrl = req.originalUrl.split("?")[0],
                reqParam = null,
                targetUrl = req.protocol + "://" + req.headers["host"];

            let renderProps = this.routerReducer(req.path, Main);

            if (renderProps) {
                let target = renderProps.component,
                    routerContext = { __initData__: null };

                try {
                    reqParam = JSON.parse(req.query.data);
                } catch (e) {}
                let requestInitialData =
                    target.requestInitialData &&
                    target.requestInitialData(targetUrl, reqParam || null);

                Promise.resolve(requestInitialData)
                    .then(data => {
                        this.createLog("Success!!!!!");
                        routerContext = { __initData__: data || null };
                        return Promise.resolve(routerContext);
                    })
                    .then(context => {
                        var body = renderToString(
                            React.createElement(
                                StaticRouter,
                                { location: req.url, context: context },
                                React.createElement(App)
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
                                _title:
                                    renderProps.title ||
                                    "Welcome To Use Example",
                                __initData__: JSON.stringify(
                                    context.__initData__
                                )
                            });
                        }
                    })
                    .catch(e => {
                        next(e);
                    });
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    }

    renderPage(req, res, next) {
        let { ssr, DEV } = this.Setting;
        if (ssr) {
            this.serverRender(req, res, next);
        } else {
            res.render("index", {
                isSSR: ssr,
                isDEV: DEV,
                _title: "Welcome To Use Example"
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
                    ieReg && ieReg[1] < browserSupport
                        ? res.sendFile(blockPageName)
                        : this.renderPage(req, res, next);
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

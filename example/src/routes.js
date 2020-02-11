import { DynamicWrapper } from "./utils/dynamic";
import DefaultLayout from "./layouts/DefaultLayout";

const RouteArr = [
    {
        path: "/",
        exact: true,
        title: "Index",
        component: DynamicWrapper(
            /**
             * {@link https://webpack.js.org/api/module-methods/#requireresolveweak}
             */
            "./main/pages/index/ui/Index.js",
            () => import(/* webpackChunkName: "index" */ "./main/pages/index/ui/Index.js")
        ),
        extra: {
            layout: DefaultLayout,
            conditional: false
        }
    },
    {
        path: "*",
        component: DynamicWrapper("./main/None.js", () =>
            import(/* webpackChunkName: "none" */ "./main/None.js")
        ),
        title: "404",
        extra: {
        }
    }
];

export default RouteArr;

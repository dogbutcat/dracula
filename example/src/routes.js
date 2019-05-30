import { DynamicWrapper } from "./utils/dynamic";

const RouteArr = [
    {
        path: "/",
        exact: true,
        component: DynamicWrapper(
            /**
             * {@link https://webpack.js.org/api/module-methods/#requireresolveweak}
             */
            require.resolveWeak("./main/index/Index.js"),
            () => import("./main/index/Index.js")
        ),
        title: "Index"
    },
    {
        path: "*",
        component: DynamicWrapper(require.resolveWeak("./main/None.js"), () =>
            import("./main/None.js")
        ),
        title: "404"
    }
];

export default RouteArr;

import React from "react";

// import { Route, Switch } from "react-router";

// //首页框体
// const App = (nextState, cb) =>
//     require.ensure(
//         [],
//         require => {
//             cb(null, require("./main/App.js"));
//         },
//         "App"
//     );

// //404页面
// const None = (nextState, cb) =>
//     require.ensure(
//         [],
//         require => {
//             cb(null, require("./main/None.js"));
//         },
//         "None"
//     );

// // 路由写这里哦！
// const Main = (
//     <Switch>
//         <App>
//             {/* 首页 */}
//             <Route
//                 exact
//                 path="/"
//                 getComponent={(nextState, cb) => {
//                     require.ensure(
//                         [],
//                         require => {
//                             cb(null, require("./main/index/Index.js"));
//                         },
//                         "Index"
//                     );
//                 }}
//             />
//             <Route key="1" path="*" getComponent={None} />,
//         </App>
//     </Switch>
// );

// import EntryPage from "./main/App";
import ErrorPage from "./main/None";
import IndexPage from "./main/index/Index";

const RouteArr = [
    {
        path: "/",
        exact: true,
		component: IndexPage,
		title: "Index"
    },
    {
        path: "*",
		component: ErrorPage,
		title: "404"
    }
];

export default RouteArr;

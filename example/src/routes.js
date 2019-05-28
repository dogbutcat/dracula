import React from "react";

const {
	Router,
	Route,
	IndexRoute,
	Redirect,
} = require("react-router");

//首页框体
const App = (nextState, cb) =>
	require.ensure(
		[],
		require => {
			cb(null, require("./main/App.js"));
		},
		"App"
	);

//404页面
const None = (nextState, cb) =>
	require.ensure(
		[],
		require => {
			cb(null, require("./main/None.js"));
		},
		"None"
	);

// 路由写这里哦！
const Main = (
	<Route path="/" getComponent={App}>
		{/* 首页 */}
		<IndexRoute
			getComponent={(nextState, cb) => {
				require.ensure(
					[],
					require => {
						cb(null, require("./main/index/Index.js"));
					},
					"Index"
				);
			}}
		/>
		<Route key="1" path="*" getComponent={None} />,
	</Route>
);

module.exports = Main;

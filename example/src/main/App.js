import React, { Component } from "react";
import less from "./App.less";

class App extends Component {
	// 如使用服务端渲染则用于产生整个html页面[替换整个html标签内的内容]，否则用于产生整体结构
	pageRender() {
		return this.props.params.__initData__ ? (
			<html>
				<head>
					<title>{this.props.title || "Dracula"}</title>
					{/* <link rel="stylesheet" href="/project/dracula.css?v=1" /> */}
					<link rel="stylesheet" href="/project/src.css?v=1" />
				</head>
				<body>
					<div id={"root"}>
						<div className={less.main}>
							<div className={less.mainBG} />
							<div className={less.mainContent}>
								<div
									className={less.container}
									style={{
										minHeight:
											typeof document !== "undefined" &&
											document.body.clientHeight - 80
									}}
								>
									{this.props.children}
								</div>
							</div>
						</div>
					</div>
					<script type="application/javascript" src="/project/spa.js?v=1" />
					<div
						id="__initData__"
						style={{ display: "none" }}
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(this.props.params.__initData__.data || {})
						}}
					/>
				</body>
			</html>
		) : (
			<div className={less.main}>
				<div className={less.mainBG} />
				<div className={less.mainContent}>
					<div
						className={less.container}
						style={{ minHeight: document.body.clientHeight - 80 }}
					>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}

	render() {
		// console.log('~~~~~~~', this.props.params.__initData__);
		return this.pageRender();
	}
}
App.contextTypes = {
	router: React.PropTypes.object,
	__initData__: React.PropTypes.string
};
module.exports = App;

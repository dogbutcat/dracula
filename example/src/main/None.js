import React, { Component } from "react";

import less from "./None.less";
class None extends Component {
	constructor(props) {
		super(props);
	}
	static childContextTypes = {
		router: React.PropTypes.object
	};

	getChildContext() {
		return {
			router: this.props.router
		};
	}

	render() {
		return (
			<div>
				<div>
					<div>很抱歉，您要访问的页面不存在！</div>
				</div>
			</div>
		);
	}
}

module.exports = None;

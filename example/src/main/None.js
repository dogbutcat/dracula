import React, { Component } from "react";

import less from "./None.less";
export default class None extends Component {
	constructor(props) {
		super(props);
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


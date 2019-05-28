import React, { Component } from "react";

class Index extends Component {
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
		return <div>Hello React!</div>;
	}
}

module.exports = Index;

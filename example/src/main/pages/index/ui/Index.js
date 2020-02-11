import React, { Component } from "react";

export default class Index extends Component {
    constructor(props) {
        super(props);
        let initData;
        if (props.staticContext) {
            initData = props.staticContext.__initData__;
        } else if (
            typeof window != "undefined" &&
            typeof window.__initData__ != "undefined"
        ) {
            initData = JSON.parse(window.__initData__.innerText);
            window.__initData__.parentNode.removeChild(window.__initData__);
        } else {
            initData = null;
        }
        this.state = {
            initData: initData
        };
    }

    /**
     * for server side rendering
     * @param {String} url - request full address
     * @param {*} reqParam - request param
     */
    static requestInitialData(url, reqParam) {
        return Promise.resolve("this is from request!");
    }

    render() {
        return (
            <div>
                Hello React!
                <div>{JSON.stringify(this.state.initData)}</div>
            </div>
        );
    }
}

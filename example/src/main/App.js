import { hot } from 'react-hot-loader/root';
import React, { Component } from "react";
// import { renderRoutes } from "react-router-config";
import { Switch } from "react-router";

import RouteWithSubRoutes from "../components/routeWithSubRoutes/RouteWithSubRoutes";
import routes from "../routes";
import less from "./App.less";

class App extends Component {
    // 如使用服务端渲染则用于产生整个html页面[替换整个html标签内的内容]，否则用于产生整体结构
    pageRender() {
        return (
            <div className={less.main}>
                <div className={less.mainBG} />
                <div className={less.mainContent}>
                    {/* <div className={less.container} style={{ minHeight: 700 }}> */}
                        {/* {renderRoutes(this.props.route.routes)} */}
                        <Switch>
                            {routes.map((route, i) => {
                                return <RouteWithSubRoutes key={i} {...route}/>;
                            })}
                        </Switch>
                    {/* </div> */}
                </div>
            </div>
        );
    }

    render() {
        return this.pageRender();
    }
}

export default hot(App);
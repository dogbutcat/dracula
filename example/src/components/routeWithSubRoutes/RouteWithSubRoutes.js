/**
 * Why make so big change?
 * CAUSE:
 *  every time I navigate to a page under one route, which has eg. login check,
 *  although relative data is in memory but still cause page reload or lifecycle goes
 *
 * DETAIL: / ---> /
 *            |-> /distribute
 *            |-> /car -> /list
 *  mean reason for this scene after debug is this component, each time render Route component,
 *  all sub-route will render once as old one is stateless and `HOCComponent` will change every time
 *  ALSO, all routes default render method is `render`, this api is not fit the situation of keep child component
 *  as it will re-render all these ones
 *
 * FIX:
 *  there is 2 main change to this component
 *      1. change to `children` api
 *      2. change to stateful component to reserve key for further re-render helper
 *      3. do not use Layout component dynamicly, it will cause whole page unmount
 */
import React from "react";
import { Route } from "react-router";

import LoginAuth from "../authority/LoginAuth";

// import DefaultLayout from "@proj/layouts/DefaultLayout";

function withLayout(C,L){
    return class extends React.Component{
        render(){
            let props = this.props;
            return <L {...props}><C {...props}/></L>
        }
    }
}

export default class RouteWithSubRoutes extends React.Component {
    constructor(props) {
        super(props);
        let {
            component,
            isLoginRequired,
            Layout,
            filteredRouterOpts,
            children,
            routes,
            isConditional
        } = this.parseCustomROpt2RROpt(this.props);
        let BaseComponent = withLayout(component, Layout),
            HOCComponent;

        if (isLoginRequired) {
            HOCComponent = props => (
                <LoginAuth>
                        <BaseComponent {...props} />
                </LoginAuth>
            );
        } else {
            HOCComponent = BaseComponent;
        }

        /**
         * preserve option for furthur usage
         * @param {*} matchProps
         * @param {*} extraOptions
         */
        let renderFunc = (matchProps, options) => {
            // let {
            //     filteredRouterOpts,
            //     children,
            //     routes,
            //  //    Layout, //DO NOT re use layout here, because component will re-render everytime component render, cause old component unmount and new componennt created
            //     isConditional
            // } = options;

            let subView = (
                <HOCComponent
                    {...filteredRouterOpts}
                    {...matchProps}
                    routes={routes}
                    // can't wrap Switch here
                    // wrap outside to be more dynamic,
                    // like Redirect
                    childRoutes={children}
                />
            );

            // if use children render method, but not match, disable view
            if (!isConditional) {
                if (!matchProps.match) {
                    subView = null;
                }
            }
            // return (
            //     <Layout {...filteredRouterOpts} {...matchProps}>
            //         {subView}
            //     </Layout>
            // );
            return subView;
        };

        this._renderFunc = renderFunc;
    }

    /**
     * 每个nested的页面都会加上，如果默认加了，会导致/->/welcome->/welcome/again这类出现3个头部
     * 而且也不方便特殊页面的头部交互，比如右上角的额外点击出现弹窗等，不加就可以通过
     * <CustomLayout>
     *      <PageContent>
     *          <SomeComponent></SomeComponent>
     *      </PageContent>
     * </CustomLayout>
     * 所以通过改组件加载的不能再加Layout，否则会双层叠加
     */
    parseCustomROpt2RROpt(props) {
        let { children, extra, routes, ...router } = props;
        let { component, ...filteredRouterOpts } = router;

        extra = extra || {};

        return {
            filteredRouterOpts,
            component: component || (() => children),
            children,
            extra,
            routes,
            // false means use children
            isConditional: extra.conditional || false,
            // is route need login
            isLoginRequired: extra.authority,
            // Layout: extra.layout || DefaultLayout;
            Layout: extra.layout || (({ children }) => children)
        };
    }

    /**
     * why runs into render method?
     * as Route accept `location` object, so if not omit the property, it need work here
     * if omit the `location`, it all can done in constructor
     */
    render() {
        let parsedOption = this.parseCustomROpt2RROpt(this.props);
        let { filteredRouterOpts, isConditional } = parsedOption;

        let renderComp;
        /**
         * Why I set default to `render` way of Route in this component
         * FROM source code of current react-router version when Route render
         * @see {@link https://github.com/ReactTraining/react-router/blob/3d233bf0b6dd5bf68d9bac9c94273ae25646b207/packages/react-router/modules/Route.js#L111}
         * so need to realize nested component, better way is to use `children`
         */
        if (isConditional) {
            renderComp = (
                <Route
                    {...filteredRouterOpts}
                    render={m => this._renderFunc(m, parsedOption)}
                />
            );
        } else {
            renderComp = (
                <Route
                    {...filteredRouterOpts}
                    children={m => this._renderFunc(m, parsedOption)}
                />
            );
        }
        return renderComp;
    }
}

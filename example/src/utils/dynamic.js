import React, { Component } from "react";
import get from "lodash/get";
import Context from "demon/api/Context";

const withChunkExtractor = C => props => (
    <Context.Consumer>{extractor => <C __chunkExtractor={extractor} {...props} />}</Context.Consumer>
);

/**
 * cache props to ensure each
 * * principle
 *
 */
export function DynamicWrapper(moduleId, asyncComp, options) {
    let LoadingComp = get(options, "LoadingComponent", () => <p></p>); // this is async loading component
    let ErrorComp = get(options, "ErrorComponent", () => <p>load error</p>);
    let chunkName = get(options, "chunkName");

    class InnerDynamic extends Component {
        constructor(props) {
            super(props);
            if (props.__chunkExtractor && chunkName) {
                // for server render script
                props.__chunkExtractor.addChunk(chunkName);
            }
            this.loadSync();
        }
        static getDerivedStateFromProps(props, state) {
            return state;
        }
        static getDerivedStateFromError(error) {
            // Update state so the next render will show the fallback UI.
            console.error(error);
            return { error: true };
        }
        state = {
            error: null,
            loading: true,
            component: null
        };

        // if not use flag to identify which state is work, will cause
        // while sync load component mounting, async load step delete cached component and require component again
        __HOT_RELOAD__ = false;
        isMounted = false;

        // getSnapshotBeforeUpdate(prevProps, prevState) {
        // }

        componentDidUpdate(prevProps, prevState, snapshot) {
            // check cached props is same to identify component need update
            // update cached chunk key at last
            // console.warn(JSON.stringify(prevProps) !== JSON.stringify(this.props));
            // console.warn(moduleId);

            // if(JSON.stringify(prevProps) !== JSON.stringify(this.props)){
            // * this prop is from react-hot-load's react-dom
            // * as main different from props is cacheBusterProp
            // ? maybe this variable is not stable,
            // ? but so far I can only get this one to identify hot reload states
            if (this.props.cacheBusterProp) {
                this.__HOT_RELOAD__ = true;
                this.loadAsync();
            }
        }

        componentDidMount() {
            this.isMounted = true; // normal load
            this.loadAsync();
        }

        updateMountedComponentState(obj) {
            if (this.isMounted) {
                this.setState(obj);
            } else {
                this.state = obj;
            }
        }

        /**
         * load component sync
         */
        loadSync() {
            if (__webpack_modules__[moduleId]) {
                let component = __webpack_require__(moduleId); //eslint-disable-line no-undef
                let obj = {
                    component: component.default ? component.default : component
                };
                this.updateMountedComponentState(obj);
            }
        }

        loadAsync() {
            let cache = require.cache;
            // when exist cache module and in HOT_RELOAD mode
            // delete cache module
            if (cache[moduleId] && this.__HOT_RELOAD__) {
                delete cache[moduleId];
            }
            return asyncComp().then(component => {
                let obj = {
                    component: component.default ? component.default : component
                };
                this.updateMountedComponentState(obj);
                this.__HOT_RELOAD__ = false;
            });
        }

        createChildren = () => {
            let props = this.props;
            let { error, component: C } = this.state;
            let view = <LoadingComp {...props} />;
            if (C != null) {
                // let NC = refWrapper(C);
                view = <C {...props} />;
            }
            if (error) {
                view = <ErrorComp {...props} />;
            }

            return view;
        };
        render() {
            return this.createChildren();
        }
    }

    return withChunkExtractor(InnerDynamic);
}

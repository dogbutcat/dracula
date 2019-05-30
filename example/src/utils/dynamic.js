import React, { Component } from "react";

class DynamicImport extends Component {
    state = {
        component: null
    };

    isMounted = false;

    constructor(props) {
        super(props);
        this.ensureLoad(
            props.moduleId,
            props.asyncComp,
            component => {
                let obj = {
                    component: component.default ? component.default : component
                };
                if (this.isMounted) {
                    this.setState(obj);
                } else {
                    this.state = obj;
                }
            }
        );
    }

    /**
     * load component sync/async
     * @param {Number} moduleId - resolve module id
     * @param {Promise} asyncLoad - async load function
     * @param {Function} fn - in ssr mode everything need to be sync
     */
    ensureLoad(moduleId, asyncLoad, fn) {
        if (__webpack_modules__[moduleId]) {
            fn(__webpack_require__(moduleId)); //eslint-disable-line no-undef
        } else {
            asyncLoad().then(Module => fn(Module));
        }
    }

    componentDidMount() {
        this.isMounted = true; // normal load
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    render() {
        return this.props.children(this.state.component);
    }
}

export function DynamicWrapper(moduleId, asyncComp) {
    return props => (
        <DynamicImport moduleId={moduleId} asyncComp={asyncComp}>
            {C => (C == null ? <p>Loading</p> : <C {...props} />)}
        </DynamicImport>
    );
}

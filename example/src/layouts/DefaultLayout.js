import React, { Fragment, Component } from "react";

class DefaultLayout extends Component {
    render() {
        let { Header, Footer, children, ...rest } = this.props;
        return (
            <Fragment>
                <header>
                    <Header {...rest} />
                </header>
                <section>{children}</section>
                <footer>
                    <Footer {...rest} />
                </footer>
            </Fragment>
        );
    }
}

DefaultLayout.defaultProps = {
    Header: () => null,
    Footer: () => null
};

export default DefaultLayout;

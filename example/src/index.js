import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, match,Router } from 'react-router';
import routes from './routes.js';

match({ history:browserHistory, routes:routes }, (error, redirectLocation, renderProps) => {
    ReactDOM.render(<Router {...renderProps} />, document.getElementById("root"));
});

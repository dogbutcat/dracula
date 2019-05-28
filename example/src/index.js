import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import { renderRoutes } from "react-router-config";
import App from "./main/App";
import routes from "./routes.js";

ReactDOM.render(
    <BrowserRouter>
        <App />
        {/* {renderRoutes(routes)} */}
    </BrowserRouter>,
    document.getElementById("root")
);

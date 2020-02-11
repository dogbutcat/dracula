import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import { renderRoutes } from "react-router-config";
import App from "./main/App";
// import routes from "./routes.js";

import { chunkReady } from "./utils/chunkReady";

let method = "render";

if (__SSR) {
    method = "hydrate";
}

chunkReady(() => {
    ReactDOM[method](
        <BrowserRouter>
            <App />
            {/* {renderRoutes(routes)} */}
        </BrowserRouter>,
        document.getElementById("root")
    );
});

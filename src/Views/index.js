import React from "react";

import List from './List/List.js'

export default class Routes {

  apply(routeHandler) {

    const routes = [
      {
        path: "/",
        exact: true,
        component: () => <h1>Hello, World!</h1>,
      },
      {
        path: "/:chat",
        component: List,
      },
      {
        path: "/:chat/:messageId",
        component: List,
      },
    ];

    routeHandler.hooks.initRoutes.tapPromise("AppRoutes", async () => {
      routeHandler.addRoutes(routes);
    });
  }
}

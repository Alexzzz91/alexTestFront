import React from "react";

import Chat from './Chat/Chat.js'

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
        component: Chat,
      },
      {
        path: "/:chat/:messageId",
        component: Chat,
      },
    ];

    routeHandler.hooks.initRoutes.tapPromise("AppRoutes", async () => {
      routeHandler.addRoutes(routes);
    });
  }
}

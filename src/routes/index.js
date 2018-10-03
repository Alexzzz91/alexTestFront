import React from "react";

import Chat from './Chat/Chat.js'

export default class Routes {

  apply(routeHandler) {

    const routes = [
      {
        path: "/",
        exact: true,
        component: Chat,
      },
      {
        path: "/:chat/:messageId",
        component: Chat,
      },
      {
        path: "/:chat",
        component: Chat,
      }
    ];

    routeHandler.hooks.initRoutes.tapPromise("AppRoutes", async () => {
      routeHandler.addRoutes(routes);
    });
  }
}

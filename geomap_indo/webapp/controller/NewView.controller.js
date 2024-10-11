sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("geomapindo.controller.NewView", {
    onInit: function () {
      // Initialization code here
    },

    onBackPress: function () {
      // Option 1: Use router to navigate to a specific route
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("RouteGeomap");
    },
  });
});

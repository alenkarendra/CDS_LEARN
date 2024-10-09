sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/suite/ui/commons/ChartContainer",
    "sap/suite/ui/commons/ChartContainerContent",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/vbm/Spot",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    ChartContainer,
    ChartContainerContent,
    AnalyticMap,
    Spot,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("geomapindo2.controller.View1", {
      onInit: function () {
        // Objek yang mewakili tampilan UI
        var oView = this.getView();

        // this.generateSpot('idVerticalLayout');
        this.getOwnerComponent()
          .getRouter()
          .attachRoutePatternMatched(this.generateSpot, this);
      },
    });
  }
);

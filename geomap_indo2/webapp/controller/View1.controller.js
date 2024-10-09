sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/suite/ui/commons/ChartContainer",
    "sap/suite/ui/commons/ChartContainerContent",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/vbm/Spot",
    "sap/m/MessageToast",
    "sap/suite/ui/microchart/InteractiveBarChart",
    "sap/suite/ui/microchart/InteractiveBarChartBar",
  ],
  function (
    Controller,
    ChartContainer,
    ChartContainerContent,
    AnalyticMap,
    Spot,
    MessageToast,
    InteractiveBarChart,
    InteractiveBarChartBar
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

      // Fungsi press untuk chart
      press: function (oEvent) {
        MessageToast.show("The interactive bar chart is pressed.");
      },

      selectionChanged: function (oEvent) {
        var oBar = oEvent.getParameter("bar");
        MessageToast.show(
          "The selection changed: " +
            oBar.getLabel() +
            " " +
            (oBar.getSelected() ? "selected" : "deselected")
        );
      },
    });
  }
);

sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("geomapindo.controller.Tableview", {
      onInit: function () {
        console.log("Tableview initialized");

        console.log(this);

        var oData = {
          ProductCollection: [
            {
              Name: "Product A",
              ProductId: "001",
              Quantity: 10,
              Status: "Available",
              Price: 100.0,
              CurrencyCode: "USD",
              SupplierName: "Supplier X",
              ProductPicUrl:
                "https://sapui5.hana.ondemand.com/test-resources/sap/ui/documentation/sdk/images/HT-1120.jpg",
              Heavy: true,
              Category: "Category 1",
              AdditionalCategory: "Category A",
              DeliveryDate: new Date(),
            },
            {
              Name: "Product B",
              ProductId: "002",
              Quantity: 20,
              Status: "Not Available",
              Price: 150.0,
              CurrencyCode: "USD",
              SupplierName: "Supplier Y",
              ProductPicUrl: "http://example.com/imageB.jpg",
              Heavy: false,
              Category: "Category 2",
              AdditionalCategory: "Category B",
              DeliveryDate: new Date(),
            },
          ],
          Suppliers: [
            { Name: "Supplier X" },
            { Name: "Supplier Y" },
            { Name: "Supplier Z" },
          ],
          Categories: [{ Name: "Category 1" }, { Name: "Category 2" }],
        };

        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);
      },

      onBeforeExport: function (oEvent) {
        // Contoh: Mengatur properti tambahan sebelum data diekspor
        var mSettings = oEvent.getParameter("exportSettings");
        mSettings.worker = false; // setting untuk nonaktifkan Worker thread (opsional)
      },

      onBackPress: function () {
        // Option 1: Use router to navigate to a specific route
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteNewView");
      },
    });
  }
);

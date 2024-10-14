sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/suite/ui/commons/ChartContainer",
    "sap/suite/ui/commons/ChartContainerContent",
    "sap/m/MessageToast"
  ],
  function (Controller, JSONModel, ChartContainer, ChartContainerContent) {
    "use strict";

    return Controller.extend("geomapindo.controller.NewView", {
      onInit: function () {
        // Initialization code here

        // Objek yang mewakili tampilan UI
        var oView = this.getView();

        // Start Comment
        // adjustMyCharBox merupakan referensi ke objek tampilan untuk mengakses dan memanipulasi kontrol UI
        // idVizFrame -> ID dari kontrol grafik tertentu,Fungsi tersebut mungkin akan menyesuaikan
        // tata letak, properti, atau perilaku dari kontrol grafik dengan ID yang diberikan.
        // idCell1 -> ID dari suatu sel atau area dalam aplikasi SAPUI5 di mana kontrol grafik tersebut akan ditempatkan atau ditampilkan
        this.adjustMyChartBox(oView, "_IDGenVizFrame", "idCell4");
        // End Comment

        this.getOwnerComponent()
          .getRouter()
          .attachRoutePatternMatched(this.generateSpot, this);
      },

      adjustMyChartBox: function (oView, sChartId, sBlockId) {
        // VizFrame -> Bentuk-bentuk grafik yang akan dibuat ditampung dalam VizFrame
        // oView->Objek yang mewakili tampilan biasanya mengambarkan struktur UI
        // byId(sChartId) -> parameter yang dipanggil untuk mencari akses dan kontrol UI berdasarkan ID yang diberikan
        var oVizFrame = oView.byId(sChartId);

        if (!oVizFrame) {
          console.error("VizFrame not found: ", sChartId);
          return; // Exit if VizFrame is not found
        }

        // ChartContainerContent -> Elemen Individual yang bisa berisi  satu atau lebih grafik
        var oChartContainerContent = new ChartContainerContent({
          // menentukan konten yang berasal dari oVizFrame
          content: [oVizFrame],
        });

        // ChartContainer-> Induk yang dapat menampilkan serta mengelompokkan satu atau lebih grafik
        var oChartContainer = new ChartContainer({
          // menentukan konten yang berasal dari oChartContainerContent
          content: [oChartContainerContent],
        });

        //oChartContainer di setting untuk menampilkan perintah sebelum nya untuk ditampilkan fullscreen
        oChartContainer.setShowFullScreen(true);
        // oChartContainer di berikan perintah untuk menyesuaikan tinggi dan lebar sesuai ukuran layar secara otomatis
        oChartContainer.setAutoAdjustHeight(true);
        // oView memberikan tampilan UI dengan konten yang diberikan oChartContainer yang telah diidentifikasi berdasarkan ID
        oView.byId(sBlockId).addContent(oChartContainer);
      },

      onBackPress: function () {
        // Option 1: Use router to navigate to a specific route
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteGeomap");
      },

      generateSpot: function () {
        var oDataModel = this.getView().getModel();
        var that = this;

        oDataModel.read("/ZRENDRA_IDN", {
          success: function (data) {
            data.results.sort(function (a, b) {
              return b.sales - a.sales;
            });

            var aDataArray = data.results;

            //Ubah data sales menjadi Integer
            aDataArray.forEach((element) => {
              element.sales = parseInt(element.sales);
            });

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({
              salesData: aDataArray,
            });

            // console.log(data.results);

            that.getView().setModel(oModel, "salesIndo");

            // Optionally, check if the model is set in the view
            console.log("Model salesIndo data:", oModel.getData());
            console.log(
              "View's salesIndo model:",
              that.getView().getModel("salesIndo").getData()
            );
          },
          error: function (error) {
            console.error("Error fetching data:", error);
            sap.m.MessageToast.show("Error fetching data.");
          },
        });
      },
    });
  }
);

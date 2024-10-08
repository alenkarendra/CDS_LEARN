sap.ui.define(
  [
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageToast",
  ],
  function (AnalyticMap, Controller, JSONModel, Device, MessageToast) {
    "use strict";

    AnalyticMap.GeoJSONURL = "../model/idn.json";
    // AnalyticMap.GeoJSONURL = "../model/L1_US.json";
    
    return Controller.extend("sap.ui.vbm.sample.AnalyticMapRegions.Main", {
      onInit: function () {
        var oModel = new JSONModel("../model/Data_idn.json");
        console.log(oModel);
        this.getView().setModel(oModel);

        // set the device model
        var oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.getView().setModel(oDeviceModel, "device");

        oModel.attachRequestCompleted(function (oEvent) {
          for (var i = 0; i <= 50; i++) {
            var birth2013 = oModel.getProperty("/Regions/" + i + "/birth2013");
            var birth2006 = oModel.getProperty("/Regions/" + i + "/birth2006");
            var birthRate = ((birth2006 - birth2013) / birth2013) * 100;
            // console.log(birth2013, birth2006, birthRate);
            
            console.log(birthRate);
            if (birthRate >= 15) {
              oModel.setProperty("/Regions/" + i + "/color", "rgb(27,126,172)");
            } else if (birthRate >= 10) {
              oModel.setProperty("/Regions/" + i + "/color", "rgb(39,163,221)");
            } else if (birthRate >= 5) {
              oModel.setProperty("/Regions/" + i + "/color", "rgb(92,186,229)");
            } else if (birthRate >= 1) {
              oModel.setProperty(
                "/Regions/" + i + "/color",
                "rgb(132,202,236)"
              );
            } else {
              oModel.setProperty(
                "/Regions/" + i + "/color",
                "rgb(171,219,242)"
              );
            }
          }
        });

        // this.byId("vbi").setVisualFrame({
        //   minLon: -130,
        //   maxLon: -62,
        //   minLat: 15,
        //   maxLat: 58,
        //   minLOD: 4,
        // });
      },

      onPressLegend: function () {
        if (this.byId("vbi").getLegendVisible() == true) {
          this.byId("vbi").setLegendVisible(false);
          this.byId("btnLegend").setTooltip("Show legend");
        } else {
          this.byId("vbi").setLegendVisible(true);
          this.byId("btnLegend").setTooltip("Hide legend");
        }
      },

      onPressResize: function () {
        if (this.byId("btnResize").getTooltip() == "Minimize") {
          if (Device.system.phone) {
            this.byId("vbi").minimize(132, 56, 1320, 560); // Height: 3,5 rem; Width: 8,25 rem
          } else {
            this.byId("vbi").minimize(168, 72, 1680, 720); // Height: 4,5 rem; Width: 10,5 rem
          }
          this.byId("btnResize").setTooltip("Maximize");
        } else {
          this.byId("vbi").maximize();
          this.byId("btnResize").setTooltip("Minimize");
        }
      },

      onRegionClick: function (e) {
        MessageToast.show("onRegionClick " + e.getParameter("code"));
      },

      onRegionContextMenu: function (e) {
        MessageToast.show("onRegionContextMenu " + e.getParameter("code"));
      },

      onClickItem: function (evt) {
        MessageToast.show("onClick");
      },

      onContextMenuItem: function (evt) {
        MessageToast.show("onContextMenu");
      },
    });
  }
);

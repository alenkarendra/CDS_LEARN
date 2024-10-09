sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/suite/ui/commons/ChartContainer",
    "sap/suite/ui/commons/ChartContainerContent",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/vbm/Spot",
    "sap/m/MessageToast"
],
function (Controller,ChartContainer,ChartContainerContent, AnalyticMap,Spot, MessageToast) {
    "use strict";

    return Controller.extend("analyticss.controller.GeoMap", {
        onInit: function () {
            // Objek yang mewakili tampilan UI
            var oView = this.getView();

            // Start Comment
            // adjustMyCharBox merupakan referensi ke objek tampilan untuk mengakses dan memanipulasi kontrol UI
            // idVizFrame -> ID dari kontrol grafik tertentu,Fungsi tersebut mungkin akan menyesuaikan 
            // tata letak, properti, atau perilaku dari kontrol grafik dengan ID yang diberikan. 
            // idCell1 -> ID dari suatu sel atau area dalam aplikasi SAPUI5 di mana kontrol grafik tersebut akan ditempatkan atau ditampilkan
            this.adjustMyChartBox(oView,"idVizFrame1", "idCell1");
            this.adjustMyChartBox(oView,"idVizFrame2", "idCell2");
            this.adjustMyChartBox(oView,"idVizFrame3", "idCell3");
            this.adjustMyChartBox(oView,"idVizFrame4", "idCell4");
            // End Comment

            // this.generateSpot('idVerticalLayout');
            this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.generateSpot, this);
        },
        adjustMyChartBox:function(oView,sChartId,sBlockId){
            // VizFrame -> Bentuk-bentuk grafik yang akan dibuat ditampung dalam VizFrame
            // oView->Objek yang mewakili tampilan biasanya mengambarkan struktur UI
            // byId(sChartId) -> parameter yang dipanggil untuk mencari akses dan kontrol UI berdasarkan ID yang diberikan
            var oVizFrame = oView.byId(sChartId);

            // ChartContainerContent -> Elemen Individual yang bisa berisi  satu atau lebih grafik
            var oChartContainerContent = new ChartContainerContent({
                // menentukan konten yang berasal dari oVizFrame
                content:[oVizFrame]
            });

            // ChartContainer-> Induk yang dapat menampilkan serta mengelompokkan satu atau lebih grafik
            var oChartContainer = new ChartContainer({
                // menentukan konten yang berasal dari oChartContainerContent
                content:[oChartContainerContent]
            });

            //oChartContainer di setting untuk menampilkan perintah sebelum nya untuk ditampilkan fullscreen
            oChartContainer.setShowFullScreen(true);
            // oChartContainer di berikan perintah untuk menyesuaikan tinggi dan lebar sesuai ukuran layar secara otomatis
            oChartContainer.setAutoAdjustHeight(true);
            // oView memberikan tampilan UI dengan konten yang diberikan oChartContainer yang telah diidentifikasi berdasarkan ID
            oView.byId(sBlockId).addContent(oChartContainer);
        },
        generateSpot:function(){
            // MessageToast.show("The page is now loaded");
            // var oMapView = new AnalyticMap({
            //     width : "100%"
            // });
            // this.getView().byId("idVerticalLayout").addContent(oMapView);
            var oDataModel = this.getView().getModel();
            var that = this;
            oDataModel.read("/SalesCountrySet",{
                    success: function(data){
                    data.results.sort(function(a,b){
                        return b.Value - a.Value;
                    });
                    // console.log(data.results.length);
                    var aMapData = [];
                    for (var i = 0; i < data.results.length; i++) {
                        var item = data.results[i];
                        var color = 'rgb(0,255,0)';
                        item.color = color;
                        aMapData.push(item);
                    }
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({
                        "mapData" : aMapData
                    });
                    that.getView().setModel(oModel,"viewModel");
                    // that.getView().byId("idVerticalLayout").addContent(oMapView).setModel(oModel);
                    // this.getView().byId("idVerticalLayout").addContent(oMapView,"viewModel");
                }
            });
        }
    });
});

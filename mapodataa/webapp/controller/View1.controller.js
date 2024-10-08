sap.ui.define([
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Popover",
    "sap/m/Bar",
    'sap/ui/core/Fragment'
],
function (AnalyticMap, Controller, JSONModel, Device, MessageToast, Dialog, Button, Text, Popover, Bar, Fragment) {
    "use strict";

    AnalyticMap.GeoJSONURL= "../model/IDN.json";

    var url = '/sap/opu/odata/sap/ZILHAM_001_IDN_CDS'
    var oModel = new sap.ui.model.odata.v2.ODataModel(url,true);

    return Controller.extend("mapodata.controller.View1", {
        onInit: function () {
            this.getView().setModel(oModel);
            // set the device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.getView().setModel(oDeviceModel, "device");

            
            var Legend =
            [
                {
                    "text": "High",
                    "color": "rgb(43,125,43)"
                },
                {
                    "text": "Medium",
                    "color": "rgb(231,140,7)"
                },
                {
                    "text": "Low",
                    "color": "rgb(187,0,0)"
                }
            ]

            oModel.read("/Zilham_001_idn", {
                success: (oData, response) => {
                    var aDataArray = oData.results;
                    var legColor = [];
                    var alegendColor1;
                    var alegendColor2;
                    var alegendColor3;
                    var updatedLegend = [];	

                    for (let j = 0; j < Legend.length; j++) {
                        var color = Legend[j].color;
                        legColor.push(color);
                    }
                    alegendColor1 = legColor[0];
                    alegendColor2 = legColor[1];
                    alegendColor3 = legColor[2];
                    
                    for (let i = 0; i < aDataArray.length; i++) {
                        var sales = aDataArray[i].sales;
                        var coordinate = aDataArray[i].longtitude + ';' + aDataArray[i].latitude + ';0';

                        updatedLegend = aDataArray.map(item => {
                            if(sales >= 7000000000){
                                return { ...item, color:alegendColor1 ,type: "Success" ,coordinate:coordinate };
                            }else if( sales >= 40000000 && sales < 70000000){
                                return { ...item, color:alegendColor2 ,type: "Warning", coordinate:coordinate };
                            }else if( sales >= 1000000000 && sales < 4000000000){
                                return { ...item, color:alegendColor3 ,type: "Error", coordinate:coordinate };
                            }
                        });
                    }
                    
                    // Buat JSON Model dari updatedLegend
                    var oUpdatedModel = new sap.ui.model.json.JSONModel();
                    oUpdatedModel.setData({ legends: updatedLegend }); // Set data dengan properti 'legends'

                    // Mengikat model ke view
                    this.getView().setModel(oUpdatedModel, "updatedLegend");
                },
                error: (oError) => { // Menggunakan arrow function
                    console.error("Error fetching data: ", oError);
                }
            });
        }
    });
});

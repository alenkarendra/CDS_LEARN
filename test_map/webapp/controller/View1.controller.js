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

    AnalyticMap.GeoJSONURL= "../model/idn.json";
    // var oModel = new JSONModel("/model/data.json");
    let Isi = [];

    return Controller.extend("project1.controller.View1", {
        
        onInit: function () {
            this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.geoMapCollection, this);
        

            // this.getView().setModel(oModel);
            // // set the device model
            // var oDeviceModel = new JSONModel(Device);
            // oDeviceModel.setDefaultBindingMode("OneWay");
            // this.getView().setModel(oDeviceModel, "device");

            // oModel.attachRequestCompleted(function(oEvent) {
            //     var aRegions = oModel.getProperty( "/Regions/");
            //     var iItemTotals = aRegions.length;
                
            //     var aLegend = oModel.getProperty( "/Legend" );
            //     var iLegendTotals = aLegend.length;
            //     var legColor = [];
            //     var alegendColor1;
            //     var alegendColor2;
            //     var alegendColor3;	
                
            //     for (let j = 0; j < iLegendTotals; j++) {
            //         var color = oModel.getProperty( "/Legend/" + j + "/color");
            //         legColor.push(color);
            //     }

            //     alegendColor1 = legColor[0];
            //     alegendColor2 = legColor[1];
            //     alegendColor3 = legColor[2];
            //     for (let i = 0; i < iItemTotals; i++) {
            //         var sales = oModel.getProperty( "/Regions/" + i + "/sales");
                    
            //         if (sales >= 50000) {
            //             oModel.setProperty("/Regions/" + i + "/color", alegendColor1);
            //             oModel.setProperty("/Regions/" + i + "/type", "Success");
            //         }else if (sales <= 50000 && sales >= 40000){
            //             oModel.setProperty("/Regions/" + i + "/color", alegendColor2);
            //             oModel.setProperty("/Regions/" + i + "/type", "Warning");
            //         }else if(sales < 40000){
            //             oModel.setProperty("/Regions/" + i + "/color", alegendColor3);
            //             oModel.setProperty("/Regions/" + i + "/type", "Error");
            //         };
                },
         
        geoMapCollection: function () {
            let oData = this.getView().getModel();
            let x = this;

            console.log()
    
            oData.read("/Zilham_001_idn", {
                success: function (data) {
                for (let i = 0; i < data.results.length; i++) {
                    let isian = [];
                    let color = "";
                    let type = "";
                    isian = data.results[i];
                    console.log(data);
    
                    // Menambahkan data yg di butuhkan untuk geomap
                    let pos = `${data.results[i].longtitude};${data.results[i].latitude};0`;
    
                    if (data.results[i].sales >= 66000000) {
                    color = "rgb(0,255,0)";
                    type = "Success";
                    } else if (
                    data.results[i].sales >= 33000000 &&
                    data.results[i].sales < 66000000
                    ) {
                    color = "rgb(255,189,0)";
                    type = "Warning";
                    } else {
                    color = "rgb(255,0,0)";
                    type = "Error";
                    }
    
                    isian.type = type;
                    isian.color = color;
                    isian.pos = pos;
                    Isi.push(isian);
                    console.log(Isi);
                }
                var oModel = new sap.ui.model.json.JSONModel();
    
                // Set array data ke model
                oModel.setData({ products: Isi });
    
                // Mengikat model ke view
                x.getView().setModel(oModel, "productModel");
                },

            });
            },        

        onSpotClick: function(oEvent) {
            var tittle;
            var text;

            var oSpot = oEvent.getSource();
            var sPost = oSpot.getPosition();
            
            var aSpots = oModel.getProperty("/Regions");

            var aFilteredSpots = aSpots.filter(function(spot) {
                return spot.pos === sPost; // Membandingkan property 'position' dengan 'sPost'
            });
            
            for (let index = 0; index < aFilteredSpots.length; index++) {
                tittle = aFilteredSpots[index].county;
                text = 'Code : ' + aFilteredSpots[index].code + '\n ' + aFilteredSpots[index].county + '\n' +  aFilteredSpots[index].tooltip + '\n'+ 'Penjualan Barang Sekitar ' + aFilteredSpots[index].sales;
            }

            if (!this._oDialog) {
                this._oDialog = new Dialog({
                    title: tittle,
                    content: new Text({ text: text}),
                    beginButton: new Button({
                        text: "Close",
                        press: function() {
                            this._oDialog.close();
                        }.bind(this)
                    })
                });
            }

            this.getView().addDependent(this._oDialog);
            
            // Open the dialog
            this._oDialog.setTitle(tittle);  // Update the title
            this._oDialog.getContent()[0].setText(text);  // Update the content text    
            this._oDialog.open();
        },  

            });

        // onRegionClick: function(e) {
		// 	MessageToast.show("onRegionClick " + e.getParameter("code"));
		// },

		// onRegionContextMenu: function(e) {
		// 	MessageToast.show("onRegionContextMenu " + e.getParameter("code"));
		// },

		// onClickItem: function(evt) {
		// 	MessageToast.show("onClick");
		// },

		// onContextMenuItem: function(evt) {
		// 	MessageToast.show("onContextMenu");
		// },
        
        // onClickSpot: function(evt) {
        //     MessageToast.show("onClickSpot " + evt.getSource().getBindingContext().getProperty("type"));
        // },

        // onContextMenuSpot: function(evt) {
        //     MessageToast.show("onContextMenuSpot " + evt.getSource().getBindingContext().getProperty("tooltip"));
        // },

         
    
    }
);

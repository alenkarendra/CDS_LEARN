sap.ui.define(
  [
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
    "sap/ui/core/Fragment",
    "sap/ui/core/library",
    "sap/m/library",
  ],
  function (
    AnalyticMap,
    Controller,
    JSONModel,
    Device,
    MessageToast,
    Dialog,
    Button,
    Text,
    Popover,
    Bar,
    Fragment,
    coreLibrary,
    mobileLibrary
  ) {
    "use strict";

    // AnalyticMap.GeoJSONURL = "../model/indonesia.json";
    AnalyticMap.GeoJSONURL =
      "https://alenkarendra.github.io/idngeojson/idngeojson.json";
    let Isi = [];

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;
    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;
    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return Controller.extend("geomapindo.controller.Geomap", {
      onInit: function () {
        this.getOwnerComponent()
          .getRouter()
          .attachRoutePatternMatched(this.geoMapCollection, this);

        // Load the GeoJSON data and pass a callback to run when loading is done
        this.loadGeoJsonData(this.onRegionClick.bind(this));

        this.getView().addStyleClass(".highest-bar"); // Menambahkan kelas custom ke view
        var c = this.getView().addStyleClass(".highest-bar"); // Menambahkan kelas custom ke view

        this.customCSS();
      },

      onAfterRendering: function () {
        this.customCSS();
      },

      World: [],

      geoMapCollection: function () {
        let oData = this.getView().getModel();
        let that = this;

        var Legend = [
          {
            text: "High Sales",
            color: "rgb(152, 216, 170)",
          },
          {
            text: "Medium Sales",
            color: "rgb(247, 208, 96)",
          },
          {
            text: "Low Sales",
            color: "rgb(255, 109, 96)",
          },
        ];

        //CDS View Odata Services
        oData.read("/ZRENDRA_IDN", {
          success: function (data, response) {
            var aDataArray = data.results;
            var legColor = [];
            var updatedLegend = []; // Initialize updatedLegend array

            // Push legend colors into legColor array
            for (let j = 0; j < Legend.length; j++) {
              legColor.push(Legend[j]);
            }

            // Set color model to the view
            var oColorModel = new sap.ui.model.json.JSONModel({
              colors: legColor,
            });
            that.getView().setModel(oColorModel, "colorModel");

            // Create JSON Model for updated legends
            var oUpdatedModel = new sap.ui.model.json.JSONModel();
            that.getView().setModel(oUpdatedModel, "updatedLegend");

            // Cari nilai maksimum penjualan
            const maxSales = Math.max(...aDataArray.map((item) => item.sales));

            // Tentukan batas kategori berdasarkan persentase dari nilai penjualan maksimum
            const highSalesThreshold = maxSales * 0.8; // 80% of maxSales
            const mediumSalesThreshold = maxSales * 0.5; // 50% of maxSales

            for (let i = 0; i < aDataArray.length; i++) {
              // Use aDataArray instead of data.results
              let isian = {};
              let color = "";
              let type = "";
              isian = aDataArray[i]; // Use aDataArray for consistent data access

              // Menambahkan data yg di butuhkan untuk geomap
              let pos = `${aDataArray[i].longtitude};${aDataArray[i].latitude};0`; // Use aDataArray

              // HARD CODE
              // if (aDataArray[i].sales >= 6600000000) {
              //   color = "rgb(196, 218, 210)";
              //   type = "Success";
              // } else if (
              //   aDataArray[i].sales >= 3300000000 &&
              //   aDataArray[i].sales < 6600000000
              // ) {
              //   color = "rgb(106, 156, 137)";
              //   type = "Warning";
              // } else {
              //   color = "rgb(22, 66, 60)";
              //   type = "Error";
              // }

              // Menggunakan threshold dinamis berdasarkan persentase nilai maksimum
              if (aDataArray[i].sales >= highSalesThreshold) {
                color = "rgb(152, 216, 170)";
                type = "Success";
              } else if (
                aDataArray[i].sales >= mediumSalesThreshold &&
                aDataArray[i].sales < highSalesThreshold
              ) {
                color = "rgb(247, 208, 96)";
                type = "Warning";
              } else {
                color = "rgb(255, 109, 96)";
                type = "Error";
              }

              isian.type = type;
              isian.color = color;
              isian.pos = pos;

              // Masukkan item yang sudah di-update ke dalam array Isi
              Isi.push(isian);

              // Set property di dalam model dengan data terbaru
              oUpdatedModel.setProperty("/legends", Isi);

              // Set array data ke model
              // var oModel = new sap.ui.model.json.JSONModel();
              // oModel.setData({ products: Isi, legends: Legend });

              // Mengikat model ke view
              that.getView().setModel(oModel, "productModel");

              // console.log(Isi);

              // Tambahkan item berikutnya setelah sedikit penundaan
              // setTimeout(() => i + 1, 100);
            }

            // // Set array data ke model
            // var oModel = new sap.ui.model.json.JSONModel();
            // oModel.setData({ products: Isi });
            // // Mengikat model ke view
            // that.getView().setModel(oModel, "productModel");

            var salesData = that.calculatedSalesData(Isi);

            // Set array data ke model
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({
              products: Isi,
              legends: Legend,
              sales: salesData,
            });

            // Mengikat model ke view
            that.getView().setModel(oModel, "productModel");

            // oUpdatedModel.setProperty("/sales", salesData);

            // console.log(this.getView().getModel("productModel").getData());

            // console.log(salesData);
          },
          error: (oError) => {
            // Menggunakan arrow function
            console.error("Error fetching data: ", oError);
          },
        });
      },

      someFunction: function () {
        console.log("test");
      },

      customCSS: function () {
        var sId = "application-geomapindo-display-component---Geomap--_IDGenInteractiveBarChart-bar-positive-0"; // ID yang Anda dapatkan dari DOM
        console.log(sId);
        
        var bars = this.getView().byId("_IDGenInteractiveBarChart").getBars(); //Get 3 penjualan Bar
        console.log(bars);
        
        var sBarId = bars[0]; //.getId();
        console.log('bar 0 = ', sBarId);

        var d = sap.m.ValueColor; //Get Color Sapui5
        console.log(d);

        var c = bars[0].setColor("Good"); //Set Color buat di sebelah kiri label text

        var id = "application-geomapindo-display-component---Geomap--_IDGenInteractiveBarChart-bar-positive-0";

        // let cek = this.getView().byId("_IDGenInteractiveBarChart").addStyleClass("highest-bar"); //MENAMBAHKAN STYLE CLASS CSS

        var oBarHighest = sap.ui
          .getCore()
          .byId(
            "application-geomapindo-display-component---Geomap--_IDGenInteractiveBarChart-bar-positive-1"
          );
        if (oBarHighest) {
          oBarHighest.addStyleClass("highest-bar");
        }

        // var sId =
        //   "#application-geomapindo-display-component---Geomap--_IDGenInteractiveBarChart-bar-positive-1";
        // $(sId).addClass("highest-bar");

        var sChartId = this.getView().byId("_IDGenInteractiveBarChart").getId(); // Mendapatkan ID global chart

        // sChartId.addStyleClass("highest-bar");

        var oChart = this.getView().byId("_IDGenInteractiveBarChart").getBars();
        // oChart.addStyleClass("highest-bar");


       
        // Pastikan elemen tersebut ada sebelum menambah kelas CSS
        if ($(sId).length > 0) {
            $(sId).addClass("highest-bar");
        } else {
            console.error("Elemen tidak ditemukan: " + sId);
        }

        // Get ID BAR CHART
        var oBarChart = this.getView().byId("_IDGenInteractiveBarChart");
        if (oBarChart) {
          var sId = oBarChart.getId(); // Mendapatkan ID yang digenerate | application-geomapindo-display-component---Geomap--_IDGenInteractiveBarChart
          console.log("Bar Chart ID: " + sId);
        }

        console.log(sChartId);
        // console.log(oChart);

        // // Mengecek ID dan elemen
        // console.log("Chart ID: " + sChartId);
        // console.log("Bar 0 ID: " + sChartId + "-bar-positive-0");
        // console.log("Bar 1 ID: " + sChartId + "-bar-positive-1");
        // console.log("Bar 2 ID: " + sChartId + "-bar-positive-2");

        // // Mengambil referensi kontrol menggunakan ID
        // var oControl = this.byId(sChartId); // Ganti dengan ID elemen yang Anda inginkan

        // // Mengambil referensi DOM
        // var oDomElement = oControl.getDomRef();

        // if (oDomElement) {
        //   // Menambahkan class CSS
        //   $(oDomElement).addClass("customClass"); // Ganti dengan nama class yang ada di style.css
        // }

        // var test = document.getElementById(sChartId + "-bar-positive-0"); // Cek elemen chart

        // // Menambahkan kelas CSS untuk setiap bar
        // if (
        //   $("#" + jQuery.sap.encodeCSS(sChartId + "-bar-positive-0")).length
        // ) {
        //   $("#" + jQuery.sap.encodeCSS(sChartId + "-bar-positive-0")).addClass(
        //     "highest-bar"
        //   );
        //   console.log("Kelas 'highest-bar' ditambahkan ke Bar 0");
        // } else {
        //   console.log("Bar 0 tidak ditemukan!");
        // }

        // if (
        //   $("#" + jQuery.sap.encodeCSS(sChartId + "-bar-positive-1")).length
        // ) {
        //   $("#" + jQuery.sap.encodeCSS(sChartId + "-bar-positive-1")).addClass(
        //     "average-bar"
        //   );
        //   console.log("Kelas 'average-bar' ditambahkan ke Bar 1");
        // } else {
        //   console.log("Bar 1 tidak ditemukan!");
        // }

        // if (
        //   $("#" + jQuery.sap.encodeCSS(sChartId + "-bar-positive-2")).length
        // ) {
        //   $("#" + jQuery.sap.encodeCSS(sChartId + "-bar-positive-2")).addClass(
        //     "lowest-bar"
        //   );
        //   console.log("Kelas 'lowest-bar' ditambahkan ke Bar 2");
        // } else {
        //   console.log("Bar 2 tidak ditemukan!");
        // }

        // var oDomElement = this.getView().byId("_IDGenBarHighest");
        // // .getDomRef();
        // if (oDomElement) {
        //   oDomElement.classList.add("customClass");
        // } else {
        //   console.error("DOM element not found!");
        // }

        let z =  this.getView().byId("_IDGenBarHighest");
        console.log(z.oParent);

        let x = bars[0].$().addClass('biru');
        console.log(x);

        let y = new sap.ui.core.HTML({
          content: '<p><b>This text is bold</b></p>'
        });
        console.log(y);
        this.getView().addDependent(y); 
      },

      calculatedSalesData: function (salesData) {
        // debugger;
        if (!salesData || salesData.length === 0) {
          MessageToast.show("Tidak ada data penjualan");
          return;
        }

        let totalSales = 0;
        let idHighest = 0;
        let idLowest = 0;
        let cityHighest;
        let cityLowest;

        var penjualanTertinggi = salesData[0].sales;
        var penjualanTerendah = salesData[0].sales;

        // Loop untuk menghitung total, penjualan tertinggi, dan terendah
        salesData.forEach(function (item) {
          var sales = parseInt(item.sales);
          totalSales += sales;
          // debugger;

          if (item.sales > penjualanTerendah) {
            penjualanTertinggi = item.sales;
            idHighest = item.id_code;
            cityHighest = item.city;
          }
          if (item.sales < penjualanTerendah) {
            penjualanTerendah = item.sales;
            idLowest = item.id_code;
            cityLowest = item.city;
          }
        });

        var averageSales = totalSales / salesData.length;

        // let formattedSales = Number(item.sales).toLocaleString("id-ID");

        return {
          idHighest: idHighest,
          idLowest: idLowest,
          cityHighest: cityHighest,
          cityLowest: cityLowest,
          average: parseFloat(averageSales),
          highest: parseFloat(penjualanTertinggi),
          lowest: parseFloat(penjualanTerendah),
          //Variable to Display
          Daverage: Number(Math.round(averageSales)).toLocaleString("id-ID"),
          Dhighest: Number(penjualanTertinggi).toLocaleString("id-ID"),
          Dlowest: Number(penjualanTerendah).toLocaleString("id-ID"),
        };
      },

      onRegionClick: function (e) {
        let DataDetail = [];
        let DataCode = "";

        let JsonDunia = [];

        var tes = 0;
        tes = this.tesLemparVarKeluar(1, 2);

        this.loadGeoJsonData();

        JsonDunia = this.World;

        DataDetail = Isi;
        DataCode = e.getParameter("code");

        for (let i = 0; i < JsonDunia.length; i++) {
          let DataMsg = "";
          let Id2 = JsonDunia[i].id2;
          let Kode = JsonDunia[i].id;

          if (Id2 == DataCode) {
            DataMsg = JsonDunia[i].properties.name;
            DataMsg = this.toFirstCapital(DataMsg);

            MessageToast.show(DataMsg);
          } else if (Kode == DataCode) {
            DataMsg = JsonDunia[i].properties.Propinsi;
            DataMsg = this.toFirstCapital(DataMsg);

            MessageToast.show("Indonesia" + "\n\n" + DataMsg);
          }
        }

        // MessageToast.show(e.getParameter("code"));
      },

      toFirstCapital: function (text) {
        // Ubah semua teks menjadi lowercase terlebih dahulu
        let lowerCased = text.toLowerCase();

        // Split teks menjadi array kata-kata
        let words = lowerCased.split(" ");

        // Ubah huruf pertama dari setiap kata menjadi uppercase
        let capitalizedWords = words.map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        });

        // Gabungkan kembali array kata menjadi string
        return capitalizedWords.join(" ");
      },

      loadGeoJsonData: function () {
        let geoJsonArray = [];

        // Fetch the GeoJSON data from the URL
        fetch(AnalyticMap.GeoJSONURL)
          .then((response) => response.json()) // Parse the JSON from the response
          .then((data) => {
            geoJsonArray = data.features || []; // Adjust based on the actual structure
            // console.log("GeoJSON Array:", geoJsonArray);

            // Now geoJsonArray contains the data from the URL
            // You can assign it to a global variable or use it in your app
            this.World = geoJsonArray;

            // Call the callback function after data is loaded
            if (typeof callback === "function") {
              callback();
            }
          })
          .catch((error) => {
            console.error("Error fetching or processing GeoJSON data:", error);
          });
      },

      tesLemparVarKeluar: function (a, b) {
        var c;
        c = a + b;
        return c;
      },

      onSpotClick: function (oEvent) {
        var tittle;
        var text;
        var tempLegend = [];

        var oSpot = oEvent.getSource();
        var sPost = oSpot.getPosition();

        tempLegend = Isi; // Use 'this' to access the correct context

        // tempLegend.forEach((spot) => {
        //   console.log("Spot pos in data (Isi): ", spot.pos);
        // });

        var aFilteredSpots = tempLegend.filter(function (spot) {
          return spot.pos === sPost; // Membandingkan property 'position' dengan 'sPost'
        });

        for (let index = 0; index < aFilteredSpots.length; index++) {
          tittle = aFilteredSpots[index].city;

          //Format Sales
          let formattedSales = Number(
            aFilteredSpots[index].sales
          ).toLocaleString("id-ID");

          let labelWidth = 15; //Maksimum Length of the labels

          text =
            "Code".padEnd(labelWidth, "\u00A0") +
            ": " +
            aFilteredSpots[index].id_code +
            "\n" +
            "Province".padEnd(labelWidth - 2, "\u00A0") +
            ": " +
            this.toFirstCapital(aFilteredSpots[index].city) +
            "\n" +
            "P Code".padEnd(labelWidth - 2, "\u00A0") +
            ": " +
            aFilteredSpots[index].tooltip +
            "\n" +
            "Sales".padEnd(labelWidth, "\u00A0") +
            ": Rp. " +
            formattedSales;
          // aFilteredSpots[index].sales;

          // console.log(text); // Print or display the formatted text
        }

        // Membuat model JSON dan mengisi data yang telah diambil
        var oModel = new sap.ui.model.json.JSONModel({
          title: tittle,
          text: text,
        });

        if (!this._oDialog) {
          this._oDialog = new Dialog({
            type: DialogType.Message,
            title: tittle,
            // state: ValueState.Information,
            content: new Text({ text: text }),
            beginButton: new Button({
              type: ButtonType.Emphasized,
              text: "Close",
              press: function () {
                this._oDialog.close();
              }.bind(this),
            }),
          });
        }

        // Open the dialog
        this._oDialog.setTitle(tittle); // Update the title
        this._oDialog.getContent()[0].setText(text); // Update the content text
        this._oDialog.open();
      },

      onPressClick: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteNewView");
      },

      // navButtonPress: function () {
      //   // // Option 1: Use router to navigate to a specific route
      //   // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      //   // oRouter.navTo("RouteGeomap");
      //   // Option 2: Go back in browser history
      //   // window.history.go(-1);

      //   var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      //   oRouter.navTo("RouteNewView");
      // },
    });
  }
);

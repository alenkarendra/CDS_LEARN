/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"geomap_indo2/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});

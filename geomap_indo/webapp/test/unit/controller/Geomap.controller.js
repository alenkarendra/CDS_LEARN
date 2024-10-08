/*global QUnit*/

sap.ui.define([
	"geomap_indo/controller/Geomap.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Geomap Controller");

	QUnit.test("I should test the Geomap controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

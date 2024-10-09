/*global QUnit*/

sap.ui.define([
	"analyticss/controller/GeoMap.controller"
], function (Controller) {
	"use strict";

	QUnit.module("GeoMap Controller");

	QUnit.test("I should test the GeoMap controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

sap.ui.define([], function() {
	"use strict";

	return {

		creditHoldStatus: function(sStatus) {
			if (sStatus) {
				return true;
			} else {
				return false;
			}
		},
		creditBlockStatus: function(sValue) {
			if (sValue) {
				return true;
			} else {
				return false;
			}
		},
		SerializedItemStatus: function(Value) {
			if (Value) {
				return true;
			} else {
				return false;
			}
		},
		AssyOrderBlockStatus: function(assyValue) {
			if (assyValue) {
				return true;
			} else {
				return false;
			}
		}
	};
});
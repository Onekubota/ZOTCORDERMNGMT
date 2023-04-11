sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "zomtopenso/zomtopenso/model/models"], function(e, o, t) {
	"use strict";
	return e.extend("zomtopenso.zomtopenso.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {
			e.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(t.createDeviceModel(), "device");
		}
	});
});
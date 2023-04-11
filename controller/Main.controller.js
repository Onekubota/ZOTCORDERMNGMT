sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel", "sap/ui/table/Column",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", "sap/m/MessageToast", "zomtopenso/zomtopenso/model/formatter"
], function(e, t,
	i, o, Filter, FilterOperator, MessageToast, formatter) {
	"use strict";
	return e.extend("zomtopenso.zomtopenso.controller.Main", {
		formatter: formatter,
		onInit: function() {
			var e = {
				deliveryPriority: "",
				firstDate: "",
				incoterm: "",
				deliveryFlag: "",
				deliveryGroup: "",
				plant: "",
				paymentTerm: "",
				deliveryBlock: ""
			};
			var t = new sap.ui.model.json.JSONModel(e);
			this.getView().setModel(t, "MultiEditModel");

			////////////////////// MEDHAT ////////////////////////////////////
			this._smartFilterBar = this.getView().byId("smartFilterBar");
			////////////////////// MEDHAT ////////////////////////////////////

			var oTable = this.getView().byId("tableSalesOrders").getTable();
			// oTable.setMode("MultiSelect");
			// oTable.attachSelectionChange(this.onTableSelection, this);

			oTable.setSelectionMode("MultiToggle");
			oTable.attachRowSelectionChange(this.onTableSelection, this);
		},
		////////////////////// MEDHAT ////////////////////////////////////

		onBeforeRebindTable: function(oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			//////////////to get the SmartFilter Bar instance///////////////DTERA///////////
			mBindingParams.parameters = mBindingParams.parameters || {};
			var i = oEvent.getSource();
			var a = this.byId(i.getSmartFilterId());
			if (a instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
				// var ReqDelfromDate = this.getView().byId("DP5").getFrom();
				// ReqDelfromDate = this.getOriginalDateTime(ReqDelfromDate);
				// var ReqDeltoDate = this.getView().byId("DP5").getSecondDateValue();
				// ReqDeltoDate = this.getOriginalDateTime(ReqDeltoDate);
				// var MatAvlfromDate = this.getView().byId("DP6").getFrom();
				// MatAvlfromDate = this.getOriginalDateTime(MatAvlfromDate);
				// var MatAvltoDate = this.getView().byId("DP6").getSecondDateValue();
				// MatAvltoDate = this.getOriginalDateTime(MatAvltoDate);
				// var PlnDelfromDate = this.getView().byId("DP7").getFrom();
				// PlnDelfromDate = this.getOriginalDateTime(PlnDelfromDate);
				// var PlnDeltoDate = this.getView().byId("DP7").getSecondDateValue();
				// PlnDeltoDate = this.getOriginalDateTime(PlnDeltoDate);
			}
			//////////////to get the SmartFilter Bar instance///////////////DTERA///////////
			/////////////////////// Requesteddeliverydate /////////////////////////////////
			// var aFilter_Requesteddeliverydate = new Filter("Requesteddeliverydate", FilterOperator.BT, ReqDelfromDate, ReqDeltoDate);
			// mBindingParams.filters.push(aFilter_Requesteddeliverydate);
			/////////////////////// Requesteddeliverydate /////////////////////////////////

			/////////////////////// MaterialAvlDate  /////////////////////////////////
			// var aFilter_MaterialAvlDate = new Filter("MaterialAvlDate", FilterOperator.BT, MatAvlfromDate, MatAvltoDate);
			// mBindingParams.filters.push(aFilter_MaterialAvlDate);
			/////////////////////// MaterialAvlDate   /////////////////////////////////

			/////////////////////// Plandeliverycreatedate  /////////////////////////////////
			// var aFilter_Plandeliverycreatedate = new Filter("Plandeliverycreatedate", FilterOperator.BT, PlnDelfromDate, PlnDeltoDate);
			// mBindingParams.filters.push(aFilter_Plandeliverycreatedate);
			/////////////////////// Plandeliverycreatedate   /////////////////////////////////

			////////////////////// Group 1 ///////////////////////////////
			var Radio1 = this.getView().byId("APNMaterial");
			var aSelectedKey1 = Radio1.getSelectedIndex();

			var newFilter1 = new Filter("APNMaterial", FilterOperator.EQ, aSelectedKey1);
			mBindingParams.filters.push(newFilter1);
			////////////////////// Group 1 ///////////////////////////////

			////////////////////// Group 2 ///////////////////////////////
			var Radio2 = this.getView().byId("PNPowerUnit");
			var aSelectedKey2 = Radio2.getSelectedIndex();

			var newFilter2 = new Filter("PNPowerUnit", FilterOperator.EQ, aSelectedKey2);
			mBindingParams.filters.push(newFilter2);
			////////////////////// Group 2 ///////////////////////////////

			////////////////////// Group 3 ///////////////////////////////
			var Radio3 = this.getView().byId("OUAOrders");
			var aSelectedKey3 = Radio3.getSelectedIndex();

			var newFilter3 = new Filter("OUAOrders", FilterOperator.EQ, aSelectedKey3);
			mBindingParams.filters.push(newFilter3);
			////////////////////// Group 3 ///////////////////////////////

		},

		//////////////convert Date pattern ///////////////DTERA///////////
		getOriginalDateTime: function(e) {
			if (e !== undefined && e !== null && e !== "") {
				var t = sap.ui.core.format.DateFormat.getDateInstance({
					path: "fvCreatedOnDateFirst",
					type: "sap.ui.model.type.DateTime",
					formatOptions: {
						UTC: true
					},
					pattern: "yyyy-MM-dd"
				});
				var i = t.format(new Date(e));
				return i;
			}
			return null;
		},

		//////////////convert Date pattern ///////////////DTERA///////////
		////////////////////// MEDHAT ////////////////////////////////////
		///////// Enable Edit Multiple button  ///////////
		onTableSelection: function(oEvent) {
			//	var aSelectedItems = this.getView().byId("tableSalesOrders").getTable().getSelectedItems();
			var aSelectedItems = this.getView().byId("tableSalesOrders").getTable().getSelectedIndices();
			if (aSelectedItems.length > 0) {
				this.getView().byId("btnMultiEdit").setEnabled(true);
			} else if (aSelectedItems.length <= 0) {
				this.getView().byId("btnMultiEdit").setEnabled(false);
			}

		},
		///////// Open Edit Multiple -Dialog  ///////////
		onOpenMultiEdit: function() {
			t.load({
				name: "zomtopenso.zomtopenso.fragment.MultiEditDialog",
				controller: this
			}).then(function(e) {
				this.oMultiEditDialog = e;
				this.getView().addDependent(this.oMultiEditDialog);
				this.oMultiEditDialog.setEscapeHandler(function() {
					this.onCloseDialog();
				}.bind(this));
				//	this.getView().byId("delGroupInput").setValue("");
				this.oMultiEditDialog.open();
			}.bind(this));
			this.getView().getModel("MultiEditModel").setData([]);
		},
		///////// Close Edit Multiple -Dialog  ///////////
		onMultiEditClose: function() {
			this.oMultiEditDialog.close();
			this.oMultiEditDialog.destroy();
			this.oMultiEditDialog = null;
		},

		///////// Combobox selection change- Edit Multiple -Dialog  ///////////
		handleSelectionChange: function(oEvent) {
			var oSelectedParameter = oEvent.getSource();
			var oModelData = this.getView().getModel("MultiEditModel").getData();
			if (oSelectedParameter.getId() === "comboDelPriority") {
				oModelData.deliveryPriority = oEvent.getSource().getSelectedKey();
			} else if (oSelectedParameter.getId() === "comboIncoterm") {
				oModelData.incoterm = oEvent.getSource().getSelectedKey();
			} else if (oSelectedParameter.getId() === "comboPlant") {
				oModelData.plant = oEvent.getSource().getSelectedKey();
			} else if (oSelectedParameter.getId() === "comboDelBlock") {
				oModelData.deliveryBlock = oEvent.getSource().getSelectedKey();
			}
			this.getView().getModel("MultiEditModel").updateBindings(true);

		},

		///////// Checbox change - Edit Multiple -Dialog  ///////////
		handleChcbxChange: function(oEvent) {
			//	var chcbxdelFlag = this.getView().byId("chcbxDelFlag");
			var oModelData = this.getView().getModel("MultiEditModel").getData();
			if (oEvent.getSource().getSelected()) {
				oModelData.deliveryFlag = "X";
			} else if (!oEvent.getSource().getSelected()) {
				oModelData.deliveryFlag = " ";
			}
			this.getView().getModel("MultiEditModel").updateBindings(true);
		},

		///////// Date Change- Edit Multiple -Dialog  ///////////
		hanldeDateChange: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			// var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYY/MM/DD" });   
			//          var dateFormatted = dateFormat.format(sValue);
			this.getView().getModel("MultiEditModel").getData().firstDate = sValue;
			this.getView().getModel("MultiEditModel").updateBindings(true);
		},

		///////// payment Term - VH- Edit Multiple -Dialog  ///////////
		onPaymentTermVHRequest: function(oEvent) {
			this._oInput = oEvent.getSource();
			//	var s = oEvent.getSource().getValue();
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = t.load({
					id: oView.getId(),
					name: "zomtopenso.zomtopenso.fragment.PaymentTerm",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("PaymentTerms", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},
		onValueHelpSearch: function(oEvent) {
			// var sValue = oEvent.getParameter("value");
			// var oFilter = new Filter("PaymentTerms", FilterOperator.Contains, sValue);

			// oEvent.getSource().getBinding("items").filter([oFilter]);

			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("PaymentTerms", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},

		onValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oModel = this.getView().getModel("MultiEditModel");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}
			oModel.getData().paymentTerm = oSelectedItem.getTitle();
			oModel.updateBindings(true);
			this._oInput.setValue(oSelectedItem.getTitle());
		},

		///////// Mass Save -  Edit Multiple -Dialog  ///////////
		onMultiEditSave: function(oEvent) {
			// var oSelectedIndices = this.getView().byId("tableSalesOrders").getTable().getSelectedItems();
			var oSelectedIndices = this.getView().byId("tableSalesOrders").getTable().getSelectedIndices();
			var oTableRows = this.getView().byId("idTab").getBinding().aKeys;
			var oMultiEditData = this.getView().getModel("MultiEditModel").getData();
			var oModel = this.getView().getModel();
			var n = [];
			var r = {
				Data: []
			};
			if (oSelectedIndices) {
				oModel.setUseBatch(true);
				oModel.setDeferredGroups(["batchCall"]);
				for (var j = 0; j < oSelectedIndices.length; j++) {
					var a = oSelectedIndices[j];
					//	var data = this.getView().byId("tableSalesOrders").getRows()[j].getBindingContext().getObject();
					// var oCurrentSelectedItem = oSelectedIndices[j].getBindingContext().getObject();
					//		var oCurrentSelectedItem = this.getView().getModel().getProperty(this.getView().byId("idTab").getRows()[j].getBindingContext().getPath());
					var d = this.getView().getModel().getObject("/" + oTableRows[oSelectedIndices[j]]);
					//      var d =	this.getView().byId("idTab").getRows()[a].getBindingContext().getObject();
					n = {
						Salesdocument: d.Salesdocument,
						Salesdocumentitem: d.Salesdocumentitem,
						Deliverypriority: oMultiEditData.deliveryPriority,
						FirstDate: oMultiEditData.firstDate,
						IncoTerms: oMultiEditData.incoterm,
						DeliveryGroup: oMultiEditData.deliveryGroup,
						Plant: oMultiEditData.plant,
						PaymentTerm: oMultiEditData.paymentTerm,
						DeliveryBlock: oMultiEditData.deliveryBlock,
						CompleteDeliveryFlag: oMultiEditData.deliveryFlag
					};
					oModel.create("/ZOMT_MASSCHANGESet", n, {
						method: "POST",
						batchGroupId: "batchCall",
						success: function(data) {
							MessageToast.show(data.JobName + "  Scheduled");
						},
						error: function(e) {}
					});
				}
			}
			//Submitting  batch call
			oModel.submitChanges({
				batchGroupId: "batchCall", //Same as the batch group id used previously
				success: function(oData) {

				}.bind(this),
				error: function(oError) {
					MessageToast.show("Error");
				}
			});
			this.onMultiEditClose();
		},
		onPressSalesOrderNumber: function(oEvent) {
			//navigate to GUI tcode VA02 

			var salesOrderNumber = oEvent.getSource().getProperty("text");
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hashUrl = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZVA02",
					action: "display"
				},
				params: {
					"SalesOrderNumber": salesOrderNumber
				}
			}));

			sap.m.URLHelper.redirect(window.location.href.split("#")[0] + hashUrl, true);
		},
		openPaymentTermDialog: function() {
			t.load({
				name: "zomtopenso.zomtopenso.fragment.PaymentTerm",
				controller: this
			}).then(function(e) {
				this.PaymentTermDialog = e;
				this.getView().addDependent(this.PaymentTermDialog);
				this.PaymentTermDialog.setEscapeHandler(function() {
					this.onCloseDialog();
				}.bind(this));
				this.PaymentTermDialog.open();
			}.bind(this));
		},
		onPaymentTermClose: function() {
			this.PaymentTermDialog.close();
			this.PaymentTermDialog.destroy();
			this.PaymentTermDialog = null;
		},
		onDateChange: function(oEvent) {
			debugger;
		},
		DateFormatChange: function(e) {
			var t;
			if (e == null) {
				t = "0001-01-01T0:0:0";
				return t;
			} else {
				var r = new Date(e),
					a = "" + (r.getMonth() + 1),
					n = "" + r.getDate(),
					s = r.getFullYear();
				if (a.length < 2) {
					a = "0" + a;
				}
				if (n.length < 2) {
					n = "0" + n;
				}
				t = s + "-" + a + "-" + n + "T" + [r.getHours(), r.getMinutes(), r.getSeconds()].join(":");
				return t;
			}
		}
	});
});
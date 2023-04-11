sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/Column"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, JSONModel, Column) {
        "use strict";

        return Controller.extend("zomtopenso.zomtopenso.controller.Main", {
            onInit: function () {
                // that = this;
                // var oTable = that.getView().byId("idSalesOrderDetails").getTable();
                // oTable.setMode("MultiSelect");
                // oTable.attachSelectionChange(that.onTableSelection, that);
                var oListItems = {
                            deliveryPriority: "Delivery priority",
                            firstDate: "First Date",
                            incoterm: "Incoterm",
                            deliveryFlag: "Complete Delivery Flag",
                            deliveryGroup: "Delivery Group",
                            plant: "Plant",
                            paymentTerm: "Payment Term",
                            deliveryBlock: "Delivery Block"
                };
                var oModel = new sap.ui.model.json.JSONModel(oListItems);
                this.getView().setModel(oModel, "MultiEditModel");
            },
            onOpenMultiEdit: function () {
                Fragment.load({
                    name: "zomtopenso.zomtopenso.fragment.MultiEditDialog",
                    controller: this
                }).then(function (oFragment) {
                    this.oMultiEditDialog = oFragment;
                    this.getView().addDependent(this.oMultiEditDialog);
                    this.oMultiEditDialog.setEscapeHandler(function () {
                        this.onCloseDialog();
                    }.bind(this));
                    // this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("idSalesOrderDetails").getTable().getSelectedContexts());
                    // syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
                    this.oMultiEditDialog.open();
                }.bind(this));
            },
            onMultiEditClose: function () {
                this.oMultiEditDialog.close();
                this.oMultiEditDialog.destroy();
                this.oMultiEditDialog = null;
            },
            onListItemPress: function (evt) {
                var oSelectedItem = evt.getSource().getTitle();
                if (oSelectedItem === "Delivery priority") {
                    this.openDeliveryPriority();
                };
                if (oSelectedItem === "Plant") {
                    this.onValueHelpRequestPlant();
                }
                if (oSelectedItem === "First Date") {
                    this.openFirstDateDialog();
                }
                if (oSelectedItem === "Incoterm") {
                    this.openIncotermDialog();
                }
                if (oSelectedItem === "Delivery Group") {
                    this.openDeliveryGroupDialog();
                }
                if (oSelectedItem === "Payment Term") {
                    this.openPaymentTermDialog();
                }


            },
            openDeliveryPriority: function () {
                Fragment.load({
                    name: "zomtopenso.zomtopenso.fragment.DeliveryPriority",
                    controller: this
                }).then(function (oFragment) {
                    this.DeliveryPriorityDialog = oFragment;
                    this.getView().addDependent(this.DeliveryPriorityDialog);
                    this.DeliveryPriorityDialog.setEscapeHandler(function () {
                        this.onCloseDialog();
                    }.bind(this));
                    // this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("idSalesOrderDetails").getTable().getSelectedContexts());
                    // syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
                    this.DeliveryPriorityDialog.open();
                }.bind(this));
            },
            onDeliveryPriorityClose: function () {
                this.DeliveryPriorityDialog.close();
                this.DeliveryPriorityDialog.destroy();
                this.DeliveryPriorityDialog = null;
            },
            onValueHelpRequestPlant: function (e) {
                // this._oMultiInputsales = e.getSource();
                // this._oBasicSearchField = new n;
                var i = this;
                var a = this.getView();
                Fragment.load({
                    name: "zomtopenso.zomtopenso.fragment.Plant",
                    controller: this
                }).then(function e(t) {
                    i._oVHD = t;
                    i.getView().addDependent(i._oVHD);
                    //   i._oVHD.getFilterBar().setBasicSearch(i._oBasicSearchField);
                    // i._oVHD.setEscapeHandler(function(e) {});
                    // i._oBasicSearchField.attachSearch(function() {
                    //     i._oVHD.getFilterBar().search()
                    // });
                    i._oVHD.getTableAsync().then(function (e) {
                        var t = i.getOwnerComponent().getModel();
                        e.setModel(t);
                        if (e.bindRows) {
                            e.bindAggregation("rows", {
                                path: "/PlantVHSet",
                                events: {
                                    dataReceived: function () {
                                        i._oVHD.update()
                                    }
                                }
                            });
                            e.addColumn(new Column({
                                label: "Plant",
                                template: "Plant"
                            }));
                            e.addColumn(new Column({
                                label: "Description",
                                template: "PlantName"
                            }));
                        }
                        i._oVHD.update()
                    }.bind(i));
                    i._oVHD.open()
                }.bind(i))
            },
            onFilterBarPlantSearch: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("PlantVHSet");

                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new Filter({
                            path: oControl.getName(),
                            operator: FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }

                    return aResult;
                }, []);

                aFilters.push(new Filter({
                    filters: [
                        new Filter({ path: "Plant", operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: "PlantName", operator: FilterOperator.Contains, value1: sSearchQuery })
                    ],
                    and: false
                }));

                this._filterTableWhitespace(new Filter({
                    filters: aFilters,
                    and: true
                }));
            },
            _filterTableWhitespace: function (oFilter) {
                var oValueHelpDialog = this.oWhitespaceDialog;
                oValueHelpDialog.getTableAsync().then(function (oTable) {
                    if (oTable.bindRows) {
                        oTable.getBinding("rows").filter(oFilter);
                    }
                    if (oTable.bindItems) {
                        oTable.getBinding("items").filter(oFilter);
                    }
                    oValueHelpDialog.update();
                });
            },
            onValueHelpPantOkPress: function (e) {
                var t = e.getParameter("tokens");
                // this._oMultiInputsalesDis.setTokens(t);
                this._oVHD.close()
            },
            onValueHelpPlantCancelPress: function () {
                this._oVHD.destroy()
            },
            openFirstDateDialog: function () {
                Fragment.load({
                    name: "zomtopenso.zomtopenso.fragment.FirstDate",
                    controller: this
                }).then(function (oFragment) {
                    this.FirstDateDialog = oFragment;
                    this.getView().addDependent(this.FirstDateDialog);
                    this.FirstDateDialog.setEscapeHandler(function () {
                        this.onCloseDialog();
                    }.bind(this));
                    // this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("idSalesOrderDetails").getTable().getSelectedContexts());
                    // syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
                    this.FirstDateDialog.open();
                }.bind(this));
            },
            onFirstDateClose: function () {
                this.FirstDateDialog.close();
                this.FirstDateDialog.destroy();
                this.DeliveryPriorityDialog = null;
            },
            openIncotermDialog: function () {
                Fragment.load({
                    name: "zomtopenso.zomtopenso.fragment.Incoterm",
                    controller: this
                }).then(function (oFragment) {
                    this.IncotermDialog = oFragment;
                    this.getView().addDependent(this.IncotermDialog);
                    this.IncotermDialog.setEscapeHandler(function () {
                        this.onCloseDialog();
                    }.bind(this));
                    // this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("idSalesOrderDetails").getTable().getSelectedContexts());
                    // syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
                    this.IncotermDialog.open();
                }.bind(this));
            },
            onIncotermDialogClose: function () {
                this.IncotermDialog.close();
                this.IncotermDialog.destroy();
                this.IncotermDialog = null;
            },
            openDeliveryGroupDialog: function () {
                Fragment.load({
                    name: "zomtopenso.zomtopenso.fragment.DeliveryGroup",
                    controller: this
                }).then(function (oFragment) {
                    this.DeliveryGroupDialog = oFragment;
                    this.getView().addDependent(this.DeliveryGroupDialog);
                    this.DeliveryGroupDialog.setEscapeHandler(function () {
                        this.onCloseDialog();
                    }.bind(this));
                    // this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("idSalesOrderDetails").getTable().getSelectedContexts());
                    // syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
                    this.DeliveryGroupDialog.open();
                }.bind(this));
            },
            onDeliveryGroupClose: function () {
                this.DeliveryGroupDialog.close();
                this.DeliveryGroupDialog.destroy();
                this.DeliveryGroupDialog = null;
            },
            openPaymentTermDialog: function () {
                Fragment.load({
                    name: "zomtopenso.zomtopenso.fragment.PaymentTerm",
                    controller: this
                }).then(function (oFragment) {
                    this.PaymentTermDialog = oFragment;
                    this.getView().addDependent(this.PaymentTermDialog);
                    this.PaymentTermDialog.setEscapeHandler(function () {
                        this.onCloseDialog();
                    }.bind(this));
                    // this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("idSalesOrderDetails").getTable().getSelectedContexts());
                    // syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
                    this.PaymentTermDialog.open();
                }.bind(this));
            },
            onPaymentTermClose: function () {
                this.PaymentTermDialog.close();
                this.PaymentTermDialog.destroy();
                this.PaymentTermDialog = null;
            },
            // onTableSelection: function () {
            //     var aSelectedItems = that.getView().byId("idSalesOrderDetails").getTable().getSelectedItems();
            //     that.getView().byId("massEdit").setEnabled(aSelectedItems.length > 0);
            // },
        });
    });

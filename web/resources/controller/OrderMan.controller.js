sap.ui.define(
	["de/htwberlin/adbkt/basic1/controller/BaseController", "sap/m/MessageToast", "sap/ui/model/json/JSONModel"],
	function (BaseController, MessageToast, JSONModel) {
		"use strict";

		return BaseController.extend("de.htwberlin.adbkt.basic1.controller.OrderMan", {
			onInit: function () {
				var oCustomerModel = new JSONModel({
					"KID": "k",
					"Name": "Name"
				});
				this.setModel(oCustomerModel, "c");
				
				var oOrderModel = new JSONModel({
					"BID": "b",
					"Bestelldatum": "2019-04-10"
				});
				this.setModel(oOrderModel, "o");
				
				var oPositionModel = new JSONModel({
					"PID": "p",
					"Menge": 1
				});
				this.setModel(oPositionModel, "p");
			},

			onCreateUser: function (oEvent) {
				var oOdataModel = this.getModel("orderMan");
				var oNewCustomer = this.getModel("c").getData();
				var oBinding = this.byId("tableCustomers").getBinding("items");
				var oContext = oBinding.create(oNewCustomer);

				oContext.created().then(
					function () {
						MessageToast.show('Kunde "' + oNewCustomer.Name + '" angelegt.');
					},
					function (error) {
						MessageToast.show(error.responseText);
					}
				);
				this.onUpdate();
			},
			
			onCreateOrder: function (oEvent) {
				var oOdataModel = this.getModel("orderMan");
				var oNewOrder = this.getModel("o").getData();

				var oSelected = this.byId("tableCustomers").getSelectedItem();
				if (oSelected) {
					var aCells = oSelected.getCells();
					var iKID = aCells[0].getText();
				}
				oNewOrder.KID_KID = iKID;
				oNewOrder.SID_SID = 's1';
				var oBinding = this.byId("tableOrders").getBinding("items");
				var oContext = oBinding.create(oNewOrder);

				oContext.created().then(
					function () {
						MessageToast.show('Order "' + oNewOrder.BID + '" angelegt.');
					},
					function (error) {
						MessageToast.show(error.responseText);
					}
				);
				this.onUpdate();
			},
			
			onCreatePosition: function (oEvent) {
				var oOdataModel = this.getModel("orderMan");
				var oNewPosition = this.getModel("p").getData();
				var oSelected = this.byId("tableOrders").getSelectedItem();
				if (oSelected) {
					var aCells = oSelected.getCells();
					var iBID = aCells[0].getText();
				}
				oNewPosition.BID = iBID;
				var oBinding = this.byId("tablePositions").getBinding("items");
				var oContext = oBinding.create(oNewPosition);

				oContext.created().then(
					function () {
						MessageToast.show('Bestellposition "' + oNewPosition.PID + '" angelegt.');
					},
					function (error) {
						MessageToast.show(error.responseText);
					}
				);
				this.onUpdate();
			},
			
			getTableName : function() {
					var idButton = event.target.id;
				var idTable = "";
				if (idButton.includes("User")) {
					console.log("CUSTOMER");
					idTable = "tableCustomers";
				} else if (idButton.includes("Order")) {
					idTable = "tableOrders";
					console.log("ORDERS");
				} else {
					idTable = "tablePositions";
					console.log("POSITIONS");
				}
				return idTable;
			},
			
			onRefreshTable: function () {
    
				var oBinding = this.byId(this.getTableName()).getBinding("items");

				if (oBinding.hasPendingChanges()) {
					MessageBox.error("Refresh nicht möglich");
					return;
				}
				oBinding.refresh();
				MessageToast.show("Refresh erfolgreich");
			},
			
			
			onDeleteEntry: function () {
				var oSelected = this.byId(this.getTableName()).getSelectedItem();
				if (oSelected) {
					oSelected.getBindingContext("orderMan").delete("$auto").then(function () {
						MessageToast.show("Löschen erfolgreich");
					}.bind(this), function (oError) {
						MessageBox.error(oError.message);
					});
				}
			},

			onCustomerSelectionChange: function () {
				var oSelected = this.byId("tableCustomers").getSelectedItem();

				if (oSelected) {
					var aCells = oSelected.getCells();
					var sKID = aCells[0].getText();

					var oTable = this.byId("tableOrders");
					var oBinding = oTable.getBinding("items");

					var oFilter = new sap.ui.model.Filter({
						path: "KID_KID",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sKID
					});
					oBinding.filter(oFilter);
				}
			},
			
			onOrderSelectionChange: function () {
				var oSelected = this.byId("tableOrders").getSelectedItem();

				if (oSelected) {
					var aCells = oSelected.getCells();
					var sBID = aCells[0].getText();

					var oTable = this.byId("tablePositions");
					var oBinding = oTable.getBinding("items");

					var oFilter = new sap.ui.model.Filter({
						path: "BID_BID",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sBID
					});
					oBinding.filter(oFilter);
				}
			}
		});

	});
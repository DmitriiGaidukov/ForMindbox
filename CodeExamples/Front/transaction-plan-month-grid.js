ClientNetwork.controller("TransactionPlanMoneyController", [
    "$scope",
    "TransactionPlanMoneyService",
    "TranPlanMonthPeriodService",
    "SpecialActionEntityService",
    "TranMoneyPlanEditPeriodService",
    "$dialogs",
    "StateEntityService",
    "TranPlanClientGroupService",
    "TransactionPlanEntityService",
    "VipManagerService",
    function (
        $scope,
        transactionPlanMoneyService,
        periodService,
        actionService,
        moneyPeriodService,
        $dialogs,
        stateEntityService,
        tranPlanClientGroupService,
        transactionPlanEntityService,
		vipManagerService) {
        


        actionService.container().then(function (permContainer) {

            $scope.readAll = permContainer.canEditAll();

            $scope.periodDataSource.read();
        });

        // Данные для выбора периода
        $scope.periodDataSource = new kendo.data.DataSource({
            sort: [{ field: "FirstDay", dir: "desc" }],
            serverSorting: true,
            type: "odata",
            transport: {
                read: function (options) {
                    periodService.Query(options).then(function (response) {

                        //значение по дефолту 
                        var data = response.data.Data;
                        $scope.period = data[3];

                        $scope.source.read();
                    });
                }
            }
        });

        // Контрол для выбор периода
        $scope.periodOptions = {
            dataSource: $scope.periodDataSource,
            sortable: true,
            autoBind: false
        };

        // источник данных для каждодневной таблицы
        $scope.source = new kendo.data.DataSource({
            pageSize: 25,
            serverFiltering: true,
            serverPaging: true,
            serverSorting: true,
            type: "odata",
            transport: {
                read: function (options) {
                    $scope.options = options;
                    var filter = {
                        Period: $scope.period ? $scope.period.FirstDay : null,
                        StatusListIds: $scope.statusListIds,
                        ClientListIds: $scope.clientListIds,
                        VipManagerListIds: $scope.vipManagerListIds
                    };

                    if ($scope.readAll) {
                        transactionPlanMoneyService.Query(options, filter);
                    }
                    else {
                        transactionPlanMoneyService.QueryForManager(options, filter);
                    }
                },

            },
            aggregate: [
                { field: "InP22Value", aggregate: "sum" },
                { field: "InP11Value", aggregate: "sum" },
                { field: "InP12Value", aggregate: "sum" }
            ]
        });

        // настройка каждодневной таблицы
        $scope.mainGridOptions = {
            dataSource: $scope.source,
            pageable: true,
            sortable: true,
            scrollable: false,
            autoBind: false,
            rowTemplate: $("#row-template").html().replace("k-alt", ""), // реализация зебры.
            altRowTemplate: $("#row-template").html(),
            columns: [
                { field: "ClientId", title: "Клиент", width: 75 },
                { field: "StateName", title: "Статус" },
                { field: "VIP", title: "ВИП Менеджер" },
                { field: "Period", title: "Месяц" },
                {
                    field: "InP22Value", title: "Вход П22", aggregates: ["sum"],
                    footerTemplate: "#=kendo.toString(data.InP22Value.sum == null ? 0 : data.InP22Value.sum, \"n0\")#"
                },
                {
                    field: "InP11Value", title: "Вход П11", aggregates: ["sum"],
                    footerTemplate: "#=kendo.toString(data.InP11Value.sum == null ? 0 : data.InP11Value.sum, \"n0\")#"
                },
                {
                    field: "InP12Value", title: "Вход П12", aggregates: ["sum"],
                    footerTemplate: "#=kendo.toString(data.InP12Value.sum == null ? 0 : data.InP12Value.sum, \"n0\")#"
                },
                {}
            ]

        };

        // Показать диалог добавления 
        $scope.showAddDialog = function (e) {

            var dlg = $dialogs.custom().open({
                template: "/Content/views/TransactionPlan/Month/AddDialog.html",
                className: "modal-dialog",
                showClose: false,
                controller: "TransactionPlanMonthAddDialogController",
                resolve:
                {
                    dep: function depFactory() {
                        return {
                            gridRead: function () {
                                $scope.source.read();
                            }

                        }
                    }
                }
            });
        };

        // Функция открытия диалога редактирования
        $scope.openEditDialog = function (dataItem) {
            moneyPeriodService.IsAvailablePeriod(dataItem.Period).then(
                function (response) {
                    var data = response.data;
                    if (data) {
                        //получение с сервака свежей строки и открытие диалога
                        transactionPlanMoneyService.LoadDto(dataItem).then(
                            function (response) {
                                var dlg = $dialogs.custom().open({
                                    template: "/Content/views/TransactionPlan/Month/EditDialog.html",
                                    className: "modal-dialog",
                                    showClose: false,
                                    controller: "TransactionPlanMonthEditDialogController",
                                    resolve:
                                    {
                                        dep: function depFactory() {
                                            return {
                                                currentItem: response.data,
                                                gridRead: function () {
                                                    $scope.source.read();

                                                }
                                            }
                                        }
                                    }
                                });
                            });
                    }
                    else {
                        alert("Редактировать планы за данный период запрещено!");
                    }

                });
        };

        //открытие диалог показа лога
        $scope.openLogItemDialog = function (dataItem) {

            //открытие диалога
            var dlg = $dialogs.custom().open({
                template: "/Content/views/TransactionPlan/Month/ShowLogDialog.html",
                className: "modal-dialog",
                showClose: false,
                controller: "MonthLogItemDialogController",
                resolve: {
                    dep: function depFactory() {
                        return {
                            curItem: dataItem,
                            refresh: function () {
                                //$scope.source.read();
                            }
                        };
                    }
                }
            });
        };

        // обработчик кнопки "Обнуление" (присваивает "0" всем показателям в соответствующей строке грида)
        $scope.inzero = function (dataItem) {
            var res = moneyPeriodService.IsAvailablePeriod(dataItem.Period).then(
                function (response) {
                    var data = response.data;

                    if (data) {
                        var dto =
                            {
                                ClientId: dataItem.ClientId,
                                PeriodicType: 1, // Для денежных планов по оборотам используется месячный тип периода
                                Period: dataItem.Period,
                                InP11Value: 0,
                                InP12Value: 0,
                                InP22Value: 0

                            };

                        transactionPlanEntityService.Save(dto).then(function (response) {
                            $scope.source.read();
                        });
                    }
                    else {
                        alert("Редактировать планы за данный период запрещено!");
                    }
                });
        }

        $scope.search = function () {
            $scope.source.read();
        };

        //выгрузка в Excel
        $scope.downloadExcel = function () {

            var options = $scope.options;
            options.data.pageSize = null; // убираем пэйджинг
            options.data.take = null;
            options.noCount = true;

            var filter = {
                Period: $scope.period.FirstDay,
                StatusListIds: $scope.statusListIds,
                ClientListIds: $scope.clientListIds,
                //VipManagerListIds: $scope.vipManagerListIds
            };

            if ($scope.readAll) {
                transactionPlanMoneyService.DownloadExcel(options, filter);
            }
            else {
                transactionPlanMoneyService.DownloadExcelForManager(options, filter);
            }
        };


        // Статусы задач
        $scope.statusListIds = [];

        $scope.statusListFilterDataSource = new kendo.data.DataSource({
            sort: [{ field: "Name", dir: "asc" }],
            serverSorting: true,
            serverFiltering: true,
            serverPaging: true,
            pageSize: 40,
            type: "odata",
            transport: {
                read: function (options) {

                    options.noCount = true;

                    var filter = {
                        id: 1605 // Нужны статусы для задач в категории "CRM/Привлечение ВИП"                       
                    };

                    stateEntityService.Query(options, filter);
                }
            }
        });

        $scope.statusListFilterOptions = {
            placeholder: "Все статусы или выберите статус...",
            dataTextField: "Name",
            dataValueField: "id",
            filter: "startswith",
            filterable: true,
            valuePrimitive: true, //Specifies the value binding behavior for the widget. If set to true, the View-Model field will be updated with the selected item value field. If set to false, the View-Model field will be updated with the selected item.
            autoBind: false, //Controls whether to bind the widget to the data source on initialization
            dataSource: $scope.statusListFilterDataSource
        }

        // клиенты
        $scope.clientListIds = [];

        var clientListFilterDataSource = new kendo.data.DataSource({
            sort: [{ field: "ClientGroup", dir: "asc" }],
            serverSorting: true,
            serverFiltering: true,
            serverPaging: true,
            pageSize: 40,
            type: "odata",
            transport: {
                read: function (options) {

                    options.noCount = true;
                    if ($scope.readAll) {
                        tranPlanClientGroupService.Query(options);
                    }
                    else { // Счета только для конкретного менеджера
                        tranPlanClientGroupService.QueryForManager(options);
                    }
                }
            }
        });

        $scope.clientListFilterOptions = {
            placeholder: "Все клиенты или выберите конкретных...",
            dataTextField: "ClientGroup",
            dataValueField: "id",
            filter: "startswith",
            valuePrimitive: true, //Specifies the value binding behavior for the widget. If set to true, the View-Model field will be updated with the selected item value field. If set to false, the View-Model field will be updated with the selected item.
            autoBind: false, //Controls whether to bind the widget to the data source on initialization
            dataSource: clientListFilterDataSource
        }


        // Вип менеджеры
        $scope.vipManagerListIds = [];

        var vipManagerListFilterDataSource = new kendo.data.DataSource({
            sort: [{ field: "Name", dir: "asc" }],
            serverSorting: true,
            serverFiltering: true,
            serverPaging: true,
            pageSize: 40,
            type: "odata",
            transport: {
                read: function (options) {
                    options.noCount = true;
                    if ($scope.readAll) {
                        vipManagerService.Query(options);
                    }
                    else {
                        vipManagerService.QueryForManager(options);
                    }
                }
            }
        });

        $scope.vipManagerListFilterOptions = {
            placeholder: "Все ВИП менеджеры или выберите конкретных...",
            dataTextField: "Name",
            dataValueField: "id",
            filter: "startswith",
            valuePrimitive: true, //Specifies the value binding behavior for the widget. If set to true, the View-Model field will be updated with the selected item value field. If set to false, the View-Model field will be updated with the selected item.
            autoBind: false, //Controls whether to bind the widget to the data source on initialization
            dataSource: vipManagerListFilterDataSource
        }
    }
]);
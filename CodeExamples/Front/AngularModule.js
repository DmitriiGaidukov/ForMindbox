    var D3_BP = angular.module("D3_BP", ["coreModule"]);

D3_BP.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        //$urlRouterProvider.otherwise("/detailed-address");
        $stateProvider
            .state("TransLastExitNodeActionGrid",
            {
                url: "/trans-last-exit-node-action",
                templateUrl: "views/TransExitNodeActionGrid/trans-last-exit-node-action.html"
            })
            .state("DataForPaymentFundCard",
            {
                url: "/data-for-payment-fund-card",
                templateUrl: "views/DataForPaymentFundCard/data-for-payment-fund-card.html"
            })
            .state("ServicePage",
            {
                url: "/service-page",
                templateUrl: "views/ServicePage/service-page.html"
            })
            .state("people-bank-account",
            {
                url: "/people-bank-account",
                templateUrl: "views/PeopleBankAccount/people-bank-account.html"
            })
            .state("SendBankEmail",
            {
                url: "/send-bank-email",
                templateUrl: "views/SendBankEmail/send-bank-email.html"
            })
            .state("SendBankLetter",
            {
                url: "/send-bank-letter",
                templateUrl: "views/SendBankEmail/send-bank-letter.html",
                controller: "SendBankLetterController"
            })

            .state("PeopleBankAccountAttachments",
            {
                url: "/people-bank-account/:peopleBankAccountEuid/attachments",
                templateUrl: "views/PeopleBankAccountAttachments/people-bank-account-attachments.html"
            })



            /*
                документация про параметр "reloadOnSearch"
                Boolean (default true). If false will not retrigger the same state just because a search/query parameter has changed.
                Useful for when you'd like to modify $location.search() without triggering a reload.
                https://github.com/angular-ui/ui-router/wiki/Quick-Reference#reloadonsearch-v025
            */

            // главный стейт
            .state("SalesFirm",
            {
                // делаем стейт абстрактным, т.е. можно переходить только к дочерним стейтам, а непосредственно к этому стейту запрещено.
                abstract: true,
                // при переходе между сестринскими отчетами параметры кверистринга наследуются автоматически
                url: "/sales-firm?StartPeriod&EndPeriod",
                templateUrl: "views/SalesFirm/sales-firm-main-page.html",
                reloadOnSearch: false
            })
                // дочерние стейты
                .state("SalesFirm.SalesFirmReport",
                {
                    url: "/sales-firm-report",
                    templateUrl: "views/SalesFirm/sales-firm-report.html"
                })
                .state("SalesFirm.OpenedFirstBclReport",
                {
                    url: "/opened-first-bcl-report",
                    templateUrl: "views/SalesFirm/opened-first-bcl-report.html"
                })
                .state("SalesFirm.OpenedSecondBclReport",
                {
                    url: "/opened-second-bcl-report",
                    templateUrl: "views/SalesFirm/opened-second-bcl-report.html"
                })
                .state("SalesFirm.OpenedOtherBclReport",
                {
                    url: "/opened-other-bcl-report",
                    templateUrl: "views/SalesFirm/opened-other-bcl-report.html"
                })
            .state("BankLetterGrid",
            {
                url: "/bank-letter-grid",
                templateUrl: "views/bank-letter-grid/bank-letter-grid.html",
            })          
            ;
    }
]);

D3_BP.service("application", ["$rootScope", "$window", "$http", "$state", "$urlRouter", "$q",
    function ($rootScope, $window, $http, $state, $urlRouter, $q) {
        /// <summary>
        /// Базовая инициализация сервиса application,
        /// </summary>
        /// <param name="$rootScope" type="type"></param>
        /// <param name="$window" type="type"></param>
        /// <param name="$http" type="type"></param>
        /// <param name="$state" type="type"></param>
        /// <param name="$urlRouter" type="type"></param>
        /// <param name="$resource) {" type="type"></param>
        core.intializeApplicationBase(this, $rootScope, $window, $http, $state, $urlRouter, $q);
    }]);

D3_BP.controller("IndexController", ["application",
    function (application) {

    }]);
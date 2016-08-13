var app = angular.module("playground",
    [
        "ui.router",
        "ngCookies"
    ]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/PageSelector");
    $stateProvider
        .state("root", {
            url: "/",
            templateUrl: "/root.html"
        })
        .state("pageSelector", {
            url: "/PageSelector",
            templateUrl: "/PageSelector/PageSelector.html"
        })
        .state("pageSelector.index", {
            url: "/Index",
            templateUrl: "/index/index.html"
        })
        .state("pageSelector.dataAccess", {
            url: "/DataAccess",
            templateUrl: "/DataAccess/DataAccess.html"
        })
        .state("pageSelector.account", {
            url: "/Account",
            templateUrl: "/Account/Account.html"
        })
        .state("pageSelector.authorized", {
            url: "/Authorized",
            templateUrl: "/Authorized/Authorized.html"
        });
});

app.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
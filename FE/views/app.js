var app = angular.module("playground",
    [
        "ui.router"
    ]);

app.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

app.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/PageSelector");
    //
    // Now set up the states
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
        });
});
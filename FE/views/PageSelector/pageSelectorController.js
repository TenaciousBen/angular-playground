class Page{
    constructor(name, route, description){
        this.name = name;
        this.route = route;
        this.description = description;
    }
}

class PageSelectorController {
    constructor($state) {
        this.$state = $state;
        this.selectedPage = null;
        this.pages = [
            new Page("Index", "pageSelector.index", "Shows the usage of ng-options and filtering"),
            new Page("Data Access", "pageSelector.dataAccess", "Shows the usage of a base REST service with babel"),
            new Page("Account", "pageSelector.account", "Logs into or registers user accounts"),
            new Page("Authorized", "pageSelector.authorized", "Performs a sample action which requires authorization and authentication")
        ];
    }

    go(selectedPage) {
        this.$state.go(selectedPage.route);
    }
}

angular.module("playground").controller("pageSelectorController", ["$state", "accountService", PageSelectorController]);
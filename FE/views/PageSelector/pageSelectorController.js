class PageSelectorController {
    constructor($state) {
        this.$state = $state;
        this.stateName = "";
    }

    go(stateName) {
        this.$state.go(this.stateName);
    }
}

app.controller("pageSelectorController", ["$state", PageSelectorController]);
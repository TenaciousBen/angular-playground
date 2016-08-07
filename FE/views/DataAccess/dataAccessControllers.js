class DataAccessController {
    constructor(valuesService) {
        this.valuesService = valuesService;
        this.values = [];
        this.error = null;
    }


    init() {
        this.valuesService.get()
            .then(values => this.values = values)
            .catch(error => this.error = error);
    }
}

app.controller("dataAccessController", ["ValuesService", DataAccessController]);
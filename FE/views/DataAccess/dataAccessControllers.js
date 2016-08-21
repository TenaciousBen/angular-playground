export class DataAccessController {
    constructor(valuesService) {
        this.valuesService = valuesService;
        this.values = [];
        this.error = null;
        this.method = "GET";
        this.id = null;
        this.value = null;
    }

    init() {
        //here is where you'd initialize the controller if initialization had to occur
    }

    get(id = null) {
        this.valuesService.get(id)
            .then(values => this.values = values)
            .catch(error => this.error = error);
    }

    post(viewModel) {
        this.valuesService.post(viewModel)
            .then(value => this.values.push(value))
            .catch(error => this.error = error);
    }

    put(viewModel) {
        this.valuesService.put(viewModel)
            .catch(error => this.error = error);
    }

    delete(viewModel) {
        this.valuesService.post(viewModel)
            .then(value => this.values = this.values.filter(v => v.id !== viewModel.id))
            .catch(error => this.error = error);
    }
}
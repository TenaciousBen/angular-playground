import {RestServiceBase, ViewModelBase, ApiModelBase} from "../../../src/js/shared/restService";


export class MockedRestService extends RestServiceBase {
    constructor($http, $q) {
        super ($http, $q, "Mocked");
    }

    toViewModel(apiModel) {
        return new MockedViewModel(apiModel.Id, apiModel.Name);
    }

    toApiModel(viewModel) {
        return new MockedApiModel(viewModel.id, viewModel.name);
    }
}

export class MockedViewModel extends ViewModelBase {
    constructor(id, name) {
        super(id);
        this.name = name;
    }
}

export class MockedApiModel extends ApiModelBase {
    constructor(id, name) {
        super(id);
        this.Name = name;
    }
}
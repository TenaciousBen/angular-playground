import {RestServiceBase, ViewModelBase, ApiModelBase} from "../../js/shared/restService";

export class ValuesService extends RestServiceBase {
    constructor($http, $q) {
        super($http, $q, "Values");
    }

    toViewModel(apiModel) {
        return ValueViewModel.fromApiModel(apiModel);
    };

    toApiModel(viewModel) {
        return viewModel
    };
}

class ValueViewModel extends ViewModelBase {
    constructor(id, name){
        super(id);
        this.name = name;
    }

    static fromApiModel(apiModel) {
        return new ValueViewModel(apiModel.Id, apiModel.Name);
    }
}
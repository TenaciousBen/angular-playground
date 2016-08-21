import {RestServiceBase, ViewModelBase, ApiModelBase} from "../../js/shared/restService";
import {UserViewModel} from "../../js/shared/accountService";

export class UsersService extends RestServiceBase {
    constructor($http, $q) {
        super($http, $q, "Users");
    }

    toViewModel(apiModel) {
        return UserViewModel.fromApiModel(apiModel);
    };

    toApiModel(viewModel) {
        return viewModel
    };

    adminFunction(text) {
        var deferred = this.$q.defer();
        this.$http.post(this.apiUrl + "/AdminFunction", {Text: text})
            .then((response) => {
                deferred.resolve(response.data);
            })
            .catch((error) => {
                console.log("data service error");
                console.log(error);
                deferred.reject(error);
            });
        return deferred.promise;
    }
}


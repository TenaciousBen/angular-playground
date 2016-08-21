import {RestServiceBase, ViewModelBase, ApiModelBase} from "../shared/restService";

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
        console.log("text received");
        console.log(text);
        var deferred = this.$q.defer();
        this.$http.post(this.apiUrl + "/AdminFunction", {Text: text})
            .then((response) => {
                console.log("successfully ran admin function");
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

class UserViewModel extends ViewModelBase {
    constructor(id, userName) {
        super(id);
        this.userName = userName;
        this.roles = [];
    }

    static fromApiModel(apiModel){
        return new UserViewModel(apiModel.Id, apiModel.UserName);
    }
}
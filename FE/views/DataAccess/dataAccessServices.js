class RestServiceBase {
    constructor($http, $q, endpoint) {
        this.$http = $http;
        this.$q = $q;
        this.apiUrl = "http://localhost:12345/api/" + endpoint;
    }

    toViewModel(apiModel) {
        throw new Error("Abstract");
    };

    toApiModel(viewModel) {
        throw new Error("Abstract");
    };

    get(id = null) {
        var deferred = this.$q.defer();
        this.$http.get(this.apiUrl, {params: {id: id}})
            .then((response) => {
                console.log(response);
                var responseIsEnumerable = Object.prototype.toString.call(response.data) === "[object Array]";
                var enumerableData = responseIsEnumerable ? response.data : [response.data];
                var convertedData = enumerableData.map(this.toViewModel);
                deferred.resolve(convertedData);
            })
            .catch((error) => {
                deferred.reject(error);
            });
        return deferred.promise;
    };
}

class ValuesService extends RestServiceBase {
    constructor($http, $q) {
        super($http, $q, "Values");
    }

    toViewModel(apiModel) {
        console.log(apiModel);
        return ValueViewModel.fromApiModel(apiModel);
    };

    toApiModel(viewModel) {
        return viewModel
    };
}

class ValueViewModel {
    constructor(id, name){
        this.id = id;
        this.name = name;
    }

    static fromApiModel(apiModel) {
        return new ValueViewModel(apiModel.Id, apiModel.Name);
    }
}

app.service("ValuesService", ["$http", "$q", ValuesService]);
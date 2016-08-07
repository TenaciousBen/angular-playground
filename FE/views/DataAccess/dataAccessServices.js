class RestServiceBase {
    constructor($http, $q, endpoint) {
        this.$http = $http;
        this.$q = $q;
        this.apiUrl = "http://localhost:12345/api/" + endpoint;
    }

    /**
     * Converts the parameter api model to a {ViewModelBase}
     * Must be overridden in derived classes
     * @param {ApiModelBase} apiModel
     */
    toViewModel(apiModel) {
        throw new Error("Abstract");
    };

    /**
     * Converts the parameter api model to a {ViewModelBase}
     * Must be overridden in derived classes
     * @param {ViewModelBase} viewModel
     */
    toApiModel(viewModel) {
        throw new Error("Abstract");
    };

    /**
     * Issues a GET request to the API, optionally taking a numeric id for a specific item
     * Returns an array of elements, containing all items if no id is passed or just the item with
     * the matching id if an id is passed
     * @param {number=} id
     * @returns {(Promise.<Array.<ViewModelBase>>)}
     */
    get(id = null) {
        var deferred = this.$q.defer();
        var params = id ? {id: id} : {};
        this.$http.get(this.apiUrl, {params: params})
            .then((response) => {
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

    /**
     * Issues a POST request to the API for the parameter view model
     * This should cause the server to add the parameter view model to its list of entities
     * @param {ViewModelBase} viewModel
     * @returns {(Promise.<ViewModelBase>)}
     */
    post(viewModel) {
        var deferred = this.$q.defer();
        var apiModel = this.toApiModel(viewModel);
        this.$http.post(this.apiUrl, {data: apiModel})
            .then((response) => {
                var converted = this.toViewModel(response.data);
                deferred.resolve(converted);
            })
            .catch((error) => {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    /**
     * Issues a PUT request to the API with the id of the parameter view model, passing the view model
     * This should cause the server to update the value of the entity with a matching id to the values present
     * in the parameter view model
     * @param {ViewModelBase} viewModel
     * @returns {(Promise.<ViewModelBase>)}
     */
    put(viewModel){
        var deferred = this.$q.defer();
        var apiModel = this.toApiModel(viewModel);
        this.$http.put(this.apiUrl, {params: {id: apiModel.id}, data: apiModel})
            .then((response) => {
                var converted = this.toViewModel(response.data);
                deferred.resolve(converted);
            })
            .catch((error) => {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    //this is a keyword in js so perhaps best avoided, but given that Google's $http object is using it, I will too
    /**
     * Issues a DELETE request to the API with the id of the parameter view model
     * This should cause the server to delete the entity with a matching id
     * @param {ViewModelBase} viewModel
     * @returns {Promise}
     */
    delete(viewModel){
        var deferred = this.$q.defer();
        var apiModel = this.toApiModel(viewModel);
        this.$http.delete(this.apiUrl, {params: {id: apiModel.id}})
            .then((response) => {
                deferred.resolve();
            })
            .catch((error) => {
                deferred.reject(error);
            });
        return deferred.promise;
    }
}

class ValuesService extends RestServiceBase {
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

class ApiModelBase {
    constructor(id) {
        this.id = id;
    }
}

class ViewModelBase {
    constructor(id) {
        this.id = id;
    }
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

app.service("ValuesService", ["$http", "$q", ValuesService]);
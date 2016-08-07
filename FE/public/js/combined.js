;(function() {
"use strict";

"use strict";

var app = angular.module("playground", ["ui.router"]);

app.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

app.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/PageSelector");
    //
    // Now set up the states
    $stateProvider.state("root", {
        url: "/",
        templateUrl: "/root.html"
    }).state("pageSelector", {
        url: "/PageSelector",
        templateUrl: "/PageSelector/PageSelector.html"
    }).state("pageSelector.index", {
        url: "/Index",
        templateUrl: "/index/index.html"
    }).state("pageSelector.dataAccess", {
        url: "/DataAccess",
        templateUrl: "/DataAccess/DataAccess.html"
    });
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PeopleSortOption = function PeopleSortOption(display, property, reverse) {
    _classCallCheck(this, PeopleSortOption);

    this.display = display;
    this.property = property;
    this.reverse = reverse;
};

var PeopleController = function PeopleController(peopleService) {
    _classCallCheck(this, PeopleController);

    this.peopleService = peopleService;
    this.people = this.peopleService.getPeople();
    var defaultSortOption = new PeopleSortOption("alphabetical", "name", false);
    this.sortOptions = [defaultSortOption, new PeopleSortOption("oldest", "age", true)];
    this.sortBy = defaultSortOption;
};

app.controller("peopleController", ["peopleService", PeopleController]);
"use strict";
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Person = function Person(name, age) {
    _classCallCheck(this, Person);

    this.name = name;
    this.age = age;
};

var PeopleService = function () {
    function PeopleService() {
        _classCallCheck(this, PeopleService);

        this.people = [new Person("Micky", 26), new Person("Paula", 57), new Person("Jimmy", 23)];
    }

    _createClass(PeopleService, [{
        key: "getPeople",
        value: function getPeople() {
            return this.people;
        }
    }, {
        key: "setPeople",
        value: function setPeople(people) {
            this.people = people;
        }
    }]);

    return PeopleService;
}();

app.service("peopleService", [PeopleService]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = function Page(name, route, description) {
    _classCallCheck(this, Page);

    this.name = name;
    this.route = route;
    this.description = description;
};

var PageSelectorController = function () {
    function PageSelectorController($state) {
        _classCallCheck(this, PageSelectorController);

        this.$state = $state;
        this.selectedPage = null;
        this.pages = [new Page("Index", "pageSelector.index", "Shows the usage of ng-options and filtering"), new Page("Data Access", "pageSelector.dataAccess", "Shows the usage of a base REST service with babel")];
    }

    _createClass(PageSelectorController, [{
        key: "go",
        value: function go(selectedPage) {
            this.$state.go(selectedPage.route);
        }
    }]);

    return PageSelectorController;
}();

app.controller("pageSelectorController", ["$state", PageSelectorController]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataAccessController = function () {
    function DataAccessController(valuesService) {
        _classCallCheck(this, DataAccessController);

        this.valuesService = valuesService;
        this.values = [];
        this.error = null;
        this.method = "GET";
        this.id = null;
        this.value = null;
    }

    _createClass(DataAccessController, [{
        key: "init",
        value: function init() {
            //here is where you'd initialize the controller if initialization had to occur
        }
    }, {
        key: "get",
        value: function get() {
            var _this = this;

            var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            this.valuesService.get(id).then(function (values) {
                return _this.values = values;
            }).catch(function (error) {
                return _this.error = error;
            });
        }
    }, {
        key: "post",
        value: function post(viewModel) {
            var _this2 = this;

            this.valuesService.post(viewModel).then(function (value) {
                return _this2.values.push(value);
            }).catch(function (error) {
                return _this2.error = error;
            });
        }
    }, {
        key: "put",
        value: function put(viewModel) {
            var _this3 = this;

            this.valuesService.put(viewModel).catch(function (error) {
                return _this3.error = error;
            });
        }
    }, {
        key: "delete",
        value: function _delete(viewModel) {
            var _this4 = this;

            this.valuesService.post(viewModel).then(function (value) {
                return _this4.values = _this4.values.filter(function (v) {
                    return v.id !== viewModel.id;
                });
            }).catch(function (error) {
                return _this4.error = error;
            });
        }
    }]);

    return DataAccessController;
}();

app.controller("dataAccessController", ["ValuesService", DataAccessController]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestServiceBase = function () {
    function RestServiceBase($http, $q, endpoint) {
        _classCallCheck(this, RestServiceBase);

        this.$http = $http;
        this.$q = $q;
        this.apiUrl = "http://localhost:12345/api/" + endpoint;
    }

    /**
     * Converts the parameter api model to a {ViewModelBase}
     * Must be overridden in derived classes
     * @param {ApiModelBase} apiModel
     */


    _createClass(RestServiceBase, [{
        key: "toViewModel",
        value: function toViewModel(apiModel) {
            throw new Error("Abstract");
        }
    }, {
        key: "toApiModel",


        /**
         * Converts the parameter api model to a {ViewModelBase}
         * Must be overridden in derived classes
         * @param {ViewModelBase} viewModel
         */
        value: function toApiModel(viewModel) {
            throw new Error("Abstract");
        }
    }, {
        key: "get",


        /**
         * Issues a GET request to the API, optionally taking a numeric id for a specific item
         * Returns an array of elements, containing all items if no id is passed or just the item with
         * the matching id if an id is passed
         * @param {number=} id
         * @returns {(Promise.<Array.<ViewModelBase>>)}
         */
        value: function get() {
            var _this = this;

            var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            var deferred = this.$q.defer();
            var params = id ? { id: id } : {};
            this.$http.get(this.apiUrl, { params: params }).then(function (response) {
                var responseIsEnumerable = Object.prototype.toString.call(response.data) === "[object Array]";
                var enumerableData = responseIsEnumerable ? response.data : [response.data];
                var convertedData = enumerableData.map(_this.toViewModel);
                deferred.resolve(convertedData);
            }).catch(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }, {
        key: "post",


        /**
         * Issues a POST request to the API for the parameter view model
         * This should cause the server to add the parameter view model to its list of entities
         * @param {ViewModelBase} viewModel
         * @returns {(Promise.<ViewModelBase>)}
         */
        value: function post(viewModel) {
            var _this2 = this;

            var deferred = this.$q.defer();
            var apiModel = this.toApiModel(viewModel);
            this.$http.post(this.apiUrl, { data: apiModel }).then(function (response) {
                var converted = _this2.toViewModel(response.data);
                deferred.resolve(converted);
            }).catch(function (error) {
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

    }, {
        key: "put",
        value: function put(viewModel) {
            var _this3 = this;

            var deferred = this.$q.defer();
            var apiModel = this.toApiModel(viewModel);
            this.$http.put(this.apiUrl, { params: { id: apiModel.id }, data: apiModel }).then(function (response) {
                var converted = _this3.toViewModel(response.data);
                deferred.resolve(converted);
            }).catch(function (error) {
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

    }, {
        key: "delete",
        value: function _delete(viewModel) {
            var deferred = this.$q.defer();
            var apiModel = this.toApiModel(viewModel);
            this.$http.delete(this.apiUrl, { params: { id: apiModel.id } }).then(function (response) {
                deferred.resolve();
            }).catch(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }]);

    return RestServiceBase;
}();

var ValuesService = function (_RestServiceBase) {
    _inherits(ValuesService, _RestServiceBase);

    function ValuesService($http, $q) {
        _classCallCheck(this, ValuesService);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ValuesService).call(this, $http, $q, "Values"));
    }

    _createClass(ValuesService, [{
        key: "toViewModel",
        value: function toViewModel(apiModel) {
            return ValueViewModel.fromApiModel(apiModel);
        }
    }, {
        key: "toApiModel",
        value: function toApiModel(viewModel) {
            return viewModel;
        }
    }]);

    return ValuesService;
}(RestServiceBase);

var ApiModelBase = function ApiModelBase(id) {
    _classCallCheck(this, ApiModelBase);

    this.id = id;
};

var ViewModelBase = function ViewModelBase(id) {
    _classCallCheck(this, ViewModelBase);

    this.id = id;
};

var ValueViewModel = function (_ViewModelBase) {
    _inherits(ValueViewModel, _ViewModelBase);

    function ValueViewModel(id, name) {
        _classCallCheck(this, ValueViewModel);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(ValueViewModel).call(this, id));

        _this5.name = name;
        return _this5;
    }

    _createClass(ValueViewModel, null, [{
        key: "fromApiModel",
        value: function fromApiModel(apiModel) {
            return new ValueViewModel(apiModel.Id, apiModel.Name);
        }
    }]);

    return ValueViewModel;
}(ViewModelBase);

app.service("ValuesService", ["$http", "$q", ValuesService]);
}());

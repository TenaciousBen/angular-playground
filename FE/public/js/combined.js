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

var DataAccessController = function () {
    function DataAccessController(valuesService) {
        _classCallCheck(this, DataAccessController);

        this.valuesService = valuesService;
        this.values = [];
        this.error = null;
    }

    _createClass(DataAccessController, [{
        key: "init",
        value: function init() {
            var _this = this;

            this.valuesService.get().then(function (values) {
                return _this.values = values;
            }).catch(function (error) {
                return _this.error = error;
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

    _createClass(RestServiceBase, [{
        key: "toViewModel",
        value: function toViewModel(apiModel) {
            throw new Error("Abstract");
        }
    }, {
        key: "toApiModel",
        value: function toApiModel(viewModel) {
            throw new Error("Abstract");
        }
    }, {
        key: "get",
        value: function get() {
            var _this = this;

            var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            var deferred = this.$q.defer();
            this.$http.get(this.apiUrl, { params: { id: id } }).then(function (response) {
                console.log(response);
                var responseIsEnumerable = Object.prototype.toString.call(response.data) === "[object Array]";
                var enumerableData = responseIsEnumerable ? response.data : [response.data];
                var convertedData = enumerableData.map(_this.toViewModel);
                deferred.resolve(convertedData);
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
            console.log(apiModel);
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

var ValueViewModel = function () {
    function ValueViewModel(id, name) {
        _classCallCheck(this, ValueViewModel);

        this.id = id;
        this.name = name;
    }

    _createClass(ValueViewModel, null, [{
        key: "fromApiModel",
        value: function fromApiModel(apiModel) {
            return new ValueViewModel(apiModel.Id, apiModel.Name);
        }
    }]);

    return ValueViewModel;
}();

app.service("ValuesService", ["$http", "$q", ValuesService]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageSelectorController = function () {
    function PageSelectorController($state) {
        _classCallCheck(this, PageSelectorController);

        this.$state = $state;
        this.stateName = "";
    }

    _createClass(PageSelectorController, [{
        key: "go",
        value: function go(stateName) {
            this.$state.go(this.stateName);
        }
    }]);

    return PageSelectorController;
}();

app.controller("pageSelectorController", ["$state", PageSelectorController]);
}());

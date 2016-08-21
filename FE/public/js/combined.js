(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.frontendConfig = {
    protocol: "http",
    domain: "localhost.com",
    port: 8000,
    baseUrl: function baseUrl() {
        return exports.frontendConfig.protocol + "://" + exports.frontendConfig.domain + ":" + exports.frontendConfig.port;
    }
};

exports.backendConfig = {
    protocol: "http",
    domain: "localhost",
    port: 12345,
    baseUrl: function baseUrl() {
        return exports.backendConfig.protocol + "://" + exports.backendConfig.domain + ":" + exports.backendConfig.port;
    }
};

//this will be shared across node and ng, so module won't exist on ng
if (typeof module !== "undefined") {
    module.exports = {
        frontendConfig: exports.frontendConfig,
        backendConfig: exports.backendConfig
    };
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccountController = exports.AccountController = function () {
    function AccountController(accountService) {
        _classCallCheck(this, AccountController);

        this.accountService = accountService;
        this.registerModel = new RegisterModel();
        this.loginModel = new LoginModel();
        this.lastResponse = null;
        this.isLoggedIn = this.accountService.isLoggedIn();
        this.currentUser = accountService.currentUser;
        this.roleName = "";
    }

    _createClass(AccountController, [{
        key: "login",
        value: function login(loginModel) {
            var _this = this;

            this.accountService.login(loginModel.userName, loginModel.password).then(function (response) {
                _this.lastResponse = "login successful";
                _this.isLoggedIn = _this.accountService.isLoggedIn();
                _this.currentUser = _this.accountService.currentUser;
            }).catch(function (response) {
                _this.lastResponse = response;
            });
        }
    }, {
        key: "getRoles",
        value: function getRoles() {
            var _this2 = this;

            if (!this.currentUser) return;
            this.accountService.getRoles(this.currentUser.userName).then(function (roles) {
                _this2.lastResponse = "get roles successful";
                _this2.currentUser.roles = roles;
            }).catch(function (response) {
                _this2.lastResponse = response;
            });
        }
    }, {
        key: "addRole",
        value: function addRole(roleName) {
            var _this3 = this;

            if (!this.currentUser) return;
            this.accountService.addRole(this.currentUser.userName, roleName).then(function (roles) {
                _this3.lastResponse = "add role successful";
            }).catch(function (response) {
                _this3.lastResponse = response;
            });
        }
    }, {
        key: "removeRole",
        value: function removeRole(roleName) {
            var _this4 = this;

            if (!this.currentUser) return;
            this.accountService.removeRole(this.currentUser.userName, roleName).then(function (roles) {
                _this4.lastResponse = "remove role successful";
            }).catch(function (response) {
                _this4.lastResponse = response;
            });
        }
    }, {
        key: "logout",
        value: function logout() {
            this.accountService.logout();
            this.isLoggedIn = this.accountService.isLoggedIn();
        }
    }, {
        key: "register",
        value: function register(registerModel) {
            var _this5 = this;

            this.accountService.register(registerModel.userName, registerModel.password, registerModel.confirmPassword).then(function (response) {
                _this5.lastResponse = "registration successful";
            }).catch(function (response) {
                _this5.lastResponse = response;
            });
        }
    }]);

    return AccountController;
}();

var LoginModel = function LoginModel() {
    _classCallCheck(this, LoginModel);

    this.userName = "";
    this.password = "";
};

var RegisterModel = function (_LoginModel) {
    _inherits(RegisterModel, _LoginModel);

    function RegisterModel() {
        _classCallCheck(this, RegisterModel);

        var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(RegisterModel).call(this));

        _this6.confirmPassword = "";
        return _this6;
    }

    return RegisterModel;
}(LoginModel);

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthorizedController = exports.AuthorizedController = function () {
    function AuthorizedController(usersService) {
        _classCallCheck(this, AuthorizedController);

        this.usersService = usersService;
        this.users = [];
        this.text = null;
        this.lastResponse = null;
    }

    _createClass(AuthorizedController, [{
        key: "getUsers",
        value: function getUsers() {
            var _this = this;

            this.usersService.get().then(function (users) {
                console.log(users);
                _this.users = users;
                _this.lastResponse = "got users";
            }).catch(function (response) {
                _this.lastResponse = response;
            });
        }
    }, {
        key: "adminFunction",
        value: function adminFunction(text) {
            var _this2 = this;

            this.usersService.adminFunction(text).then(function (response) {
                _this2.lastResponse = response;
            }).catch(function (response) {
                _this2.lastResponse = response;
            });
        }
    }]);

    return AuthorizedController;
}();

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UsersService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _restService = require("../shared/restService");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UsersService = exports.UsersService = function (_RestServiceBase) {
    _inherits(UsersService, _RestServiceBase);

    function UsersService($http, $q) {
        _classCallCheck(this, UsersService);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(UsersService).call(this, $http, $q, "Users"));
    }

    _createClass(UsersService, [{
        key: "toViewModel",
        value: function toViewModel(apiModel) {
            return UserViewModel.fromApiModel(apiModel);
        }
    }, {
        key: "toApiModel",
        value: function toApiModel(viewModel) {
            return viewModel;
        }
    }, {
        key: "adminFunction",
        value: function adminFunction(text) {
            console.log("text received");
            console.log(text);
            var deferred = this.$q.defer();
            this.$http.post(this.apiUrl + "/AdminFunction", { Text: text }).then(function (response) {
                console.log("successfully ran admin function");
                deferred.resolve(response.data);
            }).catch(function (error) {
                console.log("data service error");
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }]);

    return UsersService;
}(_restService.RestServiceBase);

var UserViewModel = function (_ViewModelBase) {
    _inherits(UserViewModel, _ViewModelBase);

    function UserViewModel(id, userName) {
        _classCallCheck(this, UserViewModel);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(UserViewModel).call(this, id));

        _this2.userName = userName;
        _this2.roles = [];
        return _this2;
    }

    _createClass(UserViewModel, null, [{
        key: "fromApiModel",
        value: function fromApiModel(apiModel) {
            return new UserViewModel(apiModel.Id, apiModel.UserName);
        }
    }]);

    return UserViewModel;
}(_restService.ViewModelBase);

},{"../shared/restService":17}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataAccessController = exports.DataAccessController = function () {
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

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValuesService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _restService = require("../shared/restService");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValuesService = exports.ValuesService = function (_RestServiceBase) {
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
}(_restService.RestServiceBase);

var ValueViewModel = function (_ViewModelBase) {
    _inherits(ValueViewModel, _ViewModelBase);

    function ValueViewModel(id, name) {
        _classCallCheck(this, ValueViewModel);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(ValueViewModel).call(this, id));

        _this2.name = name;
        return _this2;
    }

    _createClass(ValueViewModel, null, [{
        key: "fromApiModel",
        value: function fromApiModel(apiModel) {
            return new ValueViewModel(apiModel.Id, apiModel.Name);
        }
    }]);

    return ValueViewModel;
}(_restService.ViewModelBase);

},{"../shared/restService":17}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = function Page(name, route, description) {
    _classCallCheck(this, Page);

    this.name = name;
    this.route = route;
    this.description = description;
};

var PageSelectorController = exports.PageSelectorController = function () {
    function PageSelectorController($state) {
        _classCallCheck(this, PageSelectorController);

        this.$state = $state;
        this.selectedPage = null;
        this.pages = [new Page("Index", "pageSelector.index", "Shows the usage of ng-options and filtering"), new Page("Data Access", "pageSelector.dataAccess", "Shows the usage of a base REST service with babel"), new Page("Account", "pageSelector.account", "Logs into or registers user accounts"), new Page("Authorized", "pageSelector.authorized", "Performs a sample action which requires authorization and authentication")];
    }

    _createClass(PageSelectorController, [{
        key: "go",
        value: function go(selectedPage) {
            this.$state.go(selectedPage.route);
        }
    }]);

    return PageSelectorController;
}();

},{}],8:[function(require,module,exports){
"use strict";

var _routes = require("./config/routes");

var _httpConfig = require("./config/httpConfig");

var _accountController = require("./Account/accountController");

var _AuthorizedController = require("./Authorized/AuthorizedController");

var _AuthorizedService = require("./Authorized/AuthorizedService");

var _dataAccessControllers = require("./DataAccess/dataAccessControllers");

var _dataAccessServices = require("./DataAccess/dataAccessServices");

var _indexController = require("./index/indexController");

var _indexServices = require("./index/indexServices");

var _pageSelectorController = require("./PageSelector/pageSelectorController");

var _requestBuffer = require("./shared/requestBuffer");

var _authStateService = require("./shared/authStateService");

var _authInterceptor = require("./shared/authInterceptor");

var _accountService = require("./shared/accountService");

angular.module("playground", ["ui.router", "ngCookies"])
//config
.config(_routes.routes).config(_httpConfig.httpConfig)
//account
.controller("accountController", ["accountService", _accountController.AccountController])
//authorized
.controller("authorizedController", ["usersService", _AuthorizedController.AuthorizedController]).service("usersService", ["$http", "$q", _AuthorizedService.UsersService])
//data access
.controller("dataAccessController", ["ValuesService", _dataAccessControllers.DataAccessController]).service("ValuesService", ["$http", "$q", _dataAccessServices.ValuesService])
//index
.controller("peopleController", ["peopleService", _indexController.PeopleController]).service("peopleService", [_indexServices.PeopleService])
//page selector
.controller("pageSelectorController", ["$state", "accountService", _pageSelectorController.PageSelectorController])
//shared
.factory('requestBuffer', ['$injector', _requestBuffer.requestBuffer]).service("authStateService", ["$cookies", _authStateService.AuthStateService]).factory("authInterceptor", ["$injector", "$q", "authStateService", "requestBuffer", _authInterceptor.authInterceptor]).service("accountService", ["$http", "$q", "authStateService", "requestBuffer", _accountService.AccountService]);

},{"./Account/accountController":2,"./Authorized/AuthorizedController":3,"./Authorized/AuthorizedService":4,"./DataAccess/dataAccessControllers":5,"./DataAccess/dataAccessServices":6,"./PageSelector/pageSelectorController":7,"./config/httpConfig":9,"./config/routes":10,"./index/indexController":11,"./index/indexServices":12,"./shared/accountService":13,"./shared/authInterceptor":14,"./shared/authStateService":15,"./shared/requestBuffer":16}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.httpConfig = httpConfig;
function httpConfig($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.interceptors.push('authInterceptor');
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.routes = routes;
function routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/PageSelector");
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
    }).state("pageSelector.account", {
        url: "/Account",
        templateUrl: "/Account/Account.html"
    }).state("pageSelector.authorized", {
        url: "/Authorized",
        templateUrl: "/Authorized/Authorized.html"
    });
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PeopleSortOption = function PeopleSortOption(display, property, reverse) {
    _classCallCheck(this, PeopleSortOption);

    this.display = display;
    this.property = property;
    this.reverse = reverse;
};

var PeopleController = exports.PeopleController = function PeopleController(peopleService) {
    _classCallCheck(this, PeopleController);

    this.peopleService = peopleService;
    this.people = this.peopleService.getPeople();
    var defaultSortOption = new PeopleSortOption("alphabetical", "name", false);
    this.sortOptions = [defaultSortOption, new PeopleSortOption("oldest", "age", true)];
    this.sortBy = defaultSortOption;
};

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Person = function Person(name, age) {
    _classCallCheck(this, Person);

    this.name = name;
    this.age = age;
};

var PeopleService = exports.PeopleService = function () {
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

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AccountService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serverConfig = require("../../serverConfig");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccountService = exports.AccountService = function () {
    function AccountService($http, $q, authStateService, requestBuffer) {
        _classCallCheck(this, AccountService);

        this.$http = $http;
        this.$q = $q;
        this.authStateService = authStateService;
        this.requestBuffer = requestBuffer;
        this.refreshPromise = null;
        this.currentUser = null;
        //prevents infinite recursion when receiving 401 due to lack of role/authorization, rather than lack of authentication
        this.hasRefreshed = false;
    }

    _createClass(AccountService, [{
        key: "login",
        value: function login(username, password) {
            var _this = this;

            var deferred = this.$q.defer();
            var request = this.$http({
                url: _serverConfig.backendConfig.baseUrl() + "/token",
                method: "POST",
                data: { grant_type: 'password', username: username, password: password },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function transformRequest(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }return str.join("&");
                }
            }).then(function (response) {
                console.log("logged in");
                console.log(response);
                _this.hasRefreshed = false;
                _this.authStateService.setToken(response.data.userName, response.data.access_token, response.data.refresh_token);
                _this.currentUser = new UserViewModel(-1, response.data.userName);
                deferred.resolve();
            }).catch(function (response) {
                console.log("login error");
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }
    }, {
        key: "logout",
        value: function logout() {
            if (!this.authStateService.hasToken()) return;
            this.authStateService.deleteToken();
        }
    }, {
        key: "isLoggedIn",
        value: function isLoggedIn() {
            return !!this.authStateService.hasToken();
        }
    }, {
        key: "register",
        value: function register(username, password) {
            var deferred = this.$q.defer();
            var request = this.$http({
                url: _serverConfig.backendConfig.baseUrl() + "/api/" + "account/register",
                method: "POST",
                data: { Email: username, Password: password, ConfirmPassword: password }
            }).then(function (response) {
                console.log("registered");
                console.log(response);
                deferred.resolve();
            }).catch(function (response) {
                console.log("register error");
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }
    }, {
        key: "addRole",
        value: function addRole(username, rolename) {
            var deferred = this.$q.defer();
            var request = this.$http({
                url: _serverConfig.backendConfig.baseUrl() + "/api/" + "account/addRole",
                method: "POST",
                data: { Email: username, RoleName: rolename }
            }).then(function (response) {
                console.log("added role");
                console.log(response);
                deferred.resolve();
            }).catch(function (response) {
                console.log("add role error");
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }
    }, {
        key: "removeRole",
        value: function removeRole(username, rolename) {
            var deferred = this.$q.defer();
            var request = this.$http({
                url: _serverConfig.backendConfig.baseUrl() + "/api/" + "account/removeRole",
                method: "POST",
                data: { Email: username, RoleName: rolename }
            }).then(function (response) {
                console.log("removed role");
                console.log(response);
                deferred.resolve();
            }).catch(function (response) {
                console.log("remove role error");
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }
    }, {
        key: "getRoles",
        value: function getRoles(username) {
            var deferred = this.$q.defer();
            var request = this.$http({
                url: _serverConfig.backendConfig.baseUrl() + "/api/" + "account/getRoles",
                method: "GET",
                params: { Email: username }
            }).then(function (response) {
                console.log("got roles");
                console.log(response);
                deferred.resolve(response.data);
            }).catch(function (response) {
                console.log("get roles error");
                console.log(response);
                deferred.reject(response);
            });
            return deferred.promise;
        }
    }, {
        key: "refreshToken",
        value: function refreshToken() {
            var _this2 = this;

            if (this.refreshPromise === null) {
                var token = this.authStateService.getToken();
                if (!this.hasRefreshed && token && token.refreshToken) {
                    var data = "grant_type=refresh_token&refresh_token=" + token.refreshToken;
                    var tokenUrl = _serverConfig.backendConfig.baseUrl() + '/token';
                    var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
                    this.refreshPromise = this.$http.post(tokenUrl, data, headers).then(function (response) {
                        console.log("refreshSuccessful triggered");
                        _this2.hasRefreshed = true;
                        _this2.authStateService.setToken(response.data.userName, response.data.access_token, response.data.refresh_token);
                        _this2.refreshPromise = null;
                        _this2.requestBuffer.retryAll();
                    }).catch(function (response) {
                        _this2.refreshPromise = null;
                        _this2.requestBuffer.rejectAll("Token refresh failed.");
                        _this2.logout();
                    });
                } else {
                    this.requestBuffer.rejectAll("refresh_token missing");
                }
            }
        }
    }]);

    return AccountService;
}();

},{"../../serverConfig":1}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.authInterceptor = authInterceptor;

var _serverConfig = require("../../serverConfig");

function authInterceptor($injector, $q, authStateService, requestBuffer) {
    var auth = {};

    auth.isApiRequest = function (config) {
        return config.url.indexOf(_serverConfig.backendConfig.baseUrl()) == 0;
    };

    auth.request = function (config) {
        console.log("request made");
        if (auth.isApiRequest(config)) {
            config.headers = config.headers || {};
            console.log("Giving request auth");
            if (authStateService.hasToken()) {
                var authentication = authStateService.getToken();
                config.headers.Authorization = 'Bearer ' + authentication.accessToken;
                console.log("Added auth to request");
                console.log(config);
            } else {
                //explode or something
            }
        }
        return config;
    };

    auth.responseError = function (rejection) {
        console.log("handling rejected request");
        var deferred = $q.defer();

        if (!auth.hasRefreshed && rejection.status === 401 && auth.isApiRequest(rejection.config)) {
            console.log("rejected due to 401");
            var authService = $injector.get('accountService');
            requestBuffer.append(rejection.config, deferred);
            authService.refreshToken();
        } else {
            /*console.log("_responseError reject");*/
            deferred.reject(rejection);
        }
        /*console.log("Deferred.promise for refreshToken");
         console.log(deferred.promise);*/
        return deferred.promise;
    };
    return auth;
}

},{"../../serverConfig":1}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthStateService = exports.AuthStateService = function () {
    function AuthStateService($cookies) {
        _classCallCheck(this, AuthStateService);

        this.$cookies = $cookies;
        this.authCookieName = "token";
    }

    _createClass(AuthStateService, [{
        key: "setToken",
        value: function setToken(user, accessToken, refreshToken) {
            var token = new Token(user, accessToken, refreshToken);
            var stringifiedToken = JSON.stringify(token);
            this.$cookies.put(this.authCookieName, stringifiedToken, { domain: frontendConfig.domain });
        }
    }, {
        key: "getToken",
        value: function getToken() {
            var jsonEncodedToken = this.$cookies.get(this.authCookieName);
            if (!jsonEncodedToken) return null;
            var token = JSON.parse(jsonEncodedToken);
            return token;
        }
    }, {
        key: "hasToken",
        value: function hasToken() {
            return !!this.getToken();
        }
    }, {
        key: "deleteToken",
        value: function deleteToken() {
            if (!this.hasToken()) return;
            this.$cookies.put(this.authCookieName, null, { domain: frontendConfig.domain });
        }
    }]);

    return AuthStateService;
}();

var Token = function Token(userName, accessToken, refreshToken) {
    _classCallCheck(this, Token);

    this.userName = userName;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
};

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.requestBuffer = requestBuffer;
function requestBuffer($injector) {
    var requestBufferServiceFactory = {};

    var buffer = [];

    var _append = function _append(config, deferred) {
        /*console.log("_append function triggered");*/
        return buffer.push({
            config: config,
            deferred: deferred
        });
    };

    var _retryAll = function _retryAll(configUpdater) {
        /* console.log("_retryAll function triggered");*/
        var updater = configUpdater || function (config) {
            return config;
        };
        for (var i = 0; i < buffer.length; ++i) {
            var _cfg = updater(buffer[i].config);
            if (_cfg !== false) _retryHttpRequest(_cfg, buffer[i].deferred);
        }
        buffer = [];
    };

    var _rejectAll = function _rejectAll(reason) {
        /*console.log("_rejectAll function triggered");*/
        for (var i = 0; i < buffer.length; ++i) {
            buffer[i].deferred.reject(reason || "");
        }
        buffer = [];
    };

    var _retryHttpRequest = function _retryHttpRequest(config, deferred) {
        /*console.log("_retryHttpRequest function triggered");*/
        var $http = $injector.get('$http');
        $http(config).then(function (response) {
            deferred.resolve(response);
        }, function (response) {
            deferred.reject(response);
        });
    };

    requestBufferServiceFactory.append = _append;
    requestBufferServiceFactory.retryAll = _retryAll;
    requestBufferServiceFactory.rejectAll = _rejectAll;

    return requestBufferServiceFactory;
}

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ViewModelBase = exports.ApiModelBase = exports.RestServiceBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serverConfig = require("../../serverConfig");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestServiceBase = exports.RestServiceBase = function () {
    function RestServiceBase($http, $q, endpoint) {
        _classCallCheck(this, RestServiceBase);

        this.$http = $http;
        this.$q = $q;
        this.apiUrl = _serverConfig.backendConfig.baseUrl() + "/api/" + endpoint;
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
                console.log("GET received");
                console.log(response);
                var responseIsEnumerable = Object.prototype.toString.call(response.data) === "[object Array]";
                var enumerableData = responseIsEnumerable ? response.data : [response.data];
                var convertedData = enumerableData.map(_this.toViewModel);
                console.log("converted");
                console.log(convertedData);
                deferred.resolve(convertedData);
            }).catch(function (error) {
                console.log("data service error");
                console.log(error);
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
                console.log("data service error");
                console.log(error);
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
                console.log("data service error");
                console.log(error);
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
                console.log("data service error");
                console.log(error);
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }]);

    return RestServiceBase;
}();

var ApiModelBase = exports.ApiModelBase = function ApiModelBase(id) {
    _classCallCheck(this, ApiModelBase);

    this.id = id;
};

var ViewModelBase = exports.ViewModelBase = function ViewModelBase(id) {
    _classCallCheck(this, ViewModelBase);

    this.id = id;
};

},{"../../serverConfig":1}]},{},[8])


//# sourceMappingURL=combined.js.map

import {routes} from "./config/routes";
import {httpConfig} from "./config/httpConfig";
import {AccountController} from "../views/Account/accountController";
import {AuthorizedController} from "../views/Authorized/AuthorizedController";
import {UsersService} from "../views/Authorized/AuthorizedService";
import {DataAccessController} from "../views/DataAccess/dataAccessControllers";
import {ValuesService} from "../views/DataAccess/dataAccessServices";
import {PeopleController} from "../views/index/indexController";
import {PeopleService} from "../views/index/indexServices";
import {PageSelectorController} from "../views/PageSelector/pageSelectorController";
import {AuthStateService} from "./shared/authStateService";
import {authInterceptor} from "./shared/authInterceptor";
import {AccountService} from "./shared/accountService";
const angular = require("angular");
const angularCookies = require("angular-cookies");
const angularUiRouter = require("angular-ui-router");

angular.module("playground",
    [
        "ui.router",
        "ngCookies"
    ])
    //config
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", routes])
    .config(httpConfig)
    //account
    .controller("accountController", ["accountService", AccountController])
    //authorized
    .controller("authorizedController", ["usersService", AuthorizedController])
    .service("usersService", ["$http", "$q", UsersService])
    //data access
    .controller("dataAccessController", ["ValuesService", DataAccessController])
    .service("ValuesService", ["$http", "$q", ValuesService])
    //index
    .controller("peopleController", ["peopleService", PeopleController])
    .service("peopleService", [PeopleService])
    //page selector
    .controller("pageSelectorController", ["$state", "accountService", PageSelectorController])
    //shared
    .service("authStateService", ["$cookies", AuthStateService])
    .factory("authInterceptor", ["$injector", "$q", "authStateService", authInterceptor])
    .service("accountService", ["$http", "$q", "authStateService", AccountService]);
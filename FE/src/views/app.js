import {routes} from "../js/config/routes";
import {httpConfig} from "../js/config/httpConfig";
import {AccountController} from "./Account/accountController";
import {AuthorizedController} from "./Authorized/AuthorizedController";
import {UsersService} from "./Authorized/AuthorizedService";
import {DataAccessController} from "./DataAccess/dataAccessControllers";
import {ValuesService} from "./DataAccess/dataAccessServices";
import {PeopleController} from "./index/indexController";
import {PeopleService} from "./index/indexServices";
import {PageSelectorController} from "./PageSelector/pageSelectorController";
import {AuthStateService} from "../js/shared/authStateService";
import {authInterceptor} from "../js/shared/authInterceptor";
import {AccountService} from "../js/shared/accountService";

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
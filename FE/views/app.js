import {routes} from "./config/routes";
import {httpConfig} from "./config/httpConfig";
import {AccountController} from "./Account/accountController";
import {AuthorizedController} from "./Authorized/AuthorizedController";
import {UsersService} from "./Authorized/AuthorizedService";
import {DataAccessController} from "./DataAccess/dataAccessControllers";
import {ValuesService} from "./DataAccess/dataAccessServices";
import {PeopleController} from "./index/indexController";
import {PeopleService} from "./index/indexServices";
import {PageSelectorController} from "./PageSelector/pageSelectorController";
import {requestBuffer} from "./shared/requestBuffer";
import {AuthStateService} from "./shared/authStateService";
import {authInterceptor} from "./shared/authInterceptor";
import {AccountService} from "./shared/accountService";

angular.module("playground",
    [
        "ui.router",
        "ngCookies"
    ])
    //config
    .config(routes)
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
    .factory('requestBuffer', ['$injector', requestBuffer])
    .service("authStateService", ["$cookies", AuthStateService])
    .factory("authInterceptor", ["$injector", "$q", "authStateService", "requestBuffer", authInterceptor])
    .service("accountService", ["$http", "$q", "authStateService", "requestBuffer", AccountService]);
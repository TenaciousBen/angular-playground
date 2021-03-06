import {backendConfig} from "../../../serverConfig";
import {ViewModelBase} from "../shared/restService";

export class AccountService {
    constructor($http, $q, authStateService) {
        this.$http = $http;
        this.$q = $q;
        this.authStateService = authStateService;
        this.refreshPromise = null;
        this.currentUser = null;
        //prevents infinite recursion when receiving 401 due to lack of role/authorization, rather than lack of authentication
        this.hasRefreshed = false;
    }

    login(username, password) {
        var deferred = this.$q.defer();
        var request = this.$http({
            url: backendConfig.baseUrl() + "/token",
            method: "POST",
            data: {grant_type: 'password', username: username, password: password},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(response => {
            this.hasRefreshed = false;
            this.authStateService.setToken(response.data.userName, response.data.access_token, response.data.refresh_token);
            this.currentUser = new UserViewModel(-1, response.data.userName);
            deferred.resolve();
        }).catch(response => {
            console.log("login error");
            console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    }

    logout() {
        if (!this.authStateService.hasToken()) return;
        this.authStateService.deleteToken();
    }

    isLoggedIn() {
        return !!this.authStateService.hasToken();
    }

    register(username, password) {
        var deferred = this.$q.defer();
        var request = this.$http({
            url: backendConfig.baseUrl() + "/api/" + "account/register",
            method: "POST",
            data: {Email: username, Password: password, ConfirmPassword: password}
        }).then(response => {
            deferred.resolve();
        }).catch(response => {
            console.log("register error");
            console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    }

    addRole(username, rolename) {
        var deferred = this.$q.defer();
        var request = this.$http({
            url: backendConfig.baseUrl() + "/api/" + "account/addRole",
            method: "POST",
            data: {Email: username, RoleName: rolename}
        }).then(response => {
            deferred.resolve();
        }).catch(response => {
            console.log("add role error");
            console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    }

    removeRole(username, rolename) {
        var deferred = this.$q.defer();
        var request = this.$http({
            url: backendConfig.baseUrl() + "/api/" + "account/removeRole",
            method: "POST",
            data: {Email: username, RoleName: rolename}
        }).then(response => {
            deferred.resolve();
        }).catch(response => {
            console.log("remove role error");
            console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    }

    getRoles(username) {
        var deferred = this.$q.defer();
        var request = this.$http({
            url: backendConfig.baseUrl() + "/api/" + "account/getRoles",
            method: "GET",
            params: {Email: username}
        }).then(response => {
            deferred.resolve(response.data);
        }).catch(response => {
            console.log("get roles error");
            console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    }

    refreshToken(retryHttpConfig) {
        if (this.refreshPromise === null) {
            var token = this.authStateService.getToken();
            if (!this.hasRefreshed && token && token.refreshToken) {
                var data = "grant_type=refresh_token&refresh_token=" + token.refreshToken;
                var tokenUrl = backendConfig.baseUrl() + '/token';
                var headers = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}};
                this.refreshPromise = this.$http.post(tokenUrl, data, headers)
                    .then(response => {
                        this.hasRefreshed = true;
                        this.authStateService.setToken(response.data.userName, response.data.access_token, response.data.refresh_token);
                        this.refreshPromise = null;
                        if (retryHttpConfig) return $http(retryHttpConfig);
                    })
                    .catch(response => {
                        this.refreshPromise = null;
                        this.logout();
                    });

            }
        }
    }
}

export class UserViewModel extends ViewModelBase {
    constructor(id, userName) {
        super(id);
        this.userName = userName;
        this.roles = [];
    }

    static fromApiModel(apiModel) {
        return new UserViewModel(apiModel.Id, apiModel.UserName);
    }
}
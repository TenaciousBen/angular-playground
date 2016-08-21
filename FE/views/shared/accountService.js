import {backendConfig} from "../../serverConfig";

export class AccountService {
    constructor($http, $q, authStateService, requestBuffer) {
        this.$http = $http;
        this.$q = $q;
        this.authStateService = authStateService;
        this.requestBuffer = requestBuffer;
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
            data: { grant_type: 'password', username: username, password: password },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(response => {
            console.log("logged in");
            console.log(response);
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
            data: { Email: username, Password: password, ConfirmPassword: password }
        }).then(response => {
            console.log("registered");
            console.log(response);
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
            data: { Email: username, RoleName: rolename }
        }).then(response => {
            console.log("added role");
            console.log(response);
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
            data: { Email: username, RoleName: rolename }
        }).then(response => {
            console.log("removed role");
            console.log(response);
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
            params: { Email: username }
        }).then(response => {
            console.log("got roles");
            console.log(response);
            deferred.resolve(response.data);
        }).catch(response => {
            console.log("get roles error");
            console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    }

    refreshToken() {
        if (this.refreshPromise === null) {
            var token = this.authStateService.getToken();
            if (!this.hasRefreshed && token && token.refreshToken) {
                var data = "grant_type=refresh_token&refresh_token=" + token.refreshToken;
                var tokenUrl = backendConfig.baseUrl() + '/token';
                var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
                this.refreshPromise = this.$http.post(tokenUrl, data, headers)
                    .then(response => {
                        console.log("refreshSuccessful triggered");
                        this.hasRefreshed = true;
                        this.authStateService.setToken(response.data.userName, response.data.access_token, response.data.refresh_token);
                        this.refreshPromise = null;
                        this.requestBuffer.retryAll();
                    })
                    .catch(response => {
                        this.refreshPromise = null;
                        this.requestBuffer.rejectAll("Token refresh failed.");
                        this.logout();
                    });

            } else {
                this.requestBuffer.rejectAll("refresh_token missing");
            }
        }
    }
}
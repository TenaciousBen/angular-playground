class AccountService {
    constructor($http, $q, authStateService) {
        this.$http = $http;
        this.$q = $q;
        this.authStateService = authStateService;
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
            this.authStateService.setToken(response.data.userName, response.data.access_token, response.data.refresh_token);
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
            method: "GET",
            params: { Email: username, Password: password, ConfirmPassword: password }
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
}

angular.module("playground").service("accountService", ["$http", "$q", "authStateService", AccountService]);
function authInterceptor(authStateService) {
    var auth = {};

    auth.isApiRequest = function(config) {
        return config.url.indexOf(backendConfig.baseUrl()) == 0;
    };

    auth.request = function(config) {
        console.log("request made");
        if (auth.isApiRequest(config)) {
            config.headers = config.headers || {};
            console.log("Giving request auth");
            if (authStateService.hasToken()) {
                var authentication = authStateService.getToken();
                config.headers.Authorization = 'Bearer ' + authentication.accessToken;
                console.log("Added auth to request");
            }
            else {
                //explode or something
            }
        }
        return config
    };

    //Not yet implemented
    //  auth.responseError = function(rejection) {
    //     console.log("handling rejected request");
    //     var deferred = $q.defer();
    //
    //     if (rejection.status === 401 && this.isApiRequest(rejection.config)) {
    //         console.log("rejected due to 401");
    //         var authService = $injector.get('loginService');
    //         $requestBuffer.append(rejection.config, deferred);
    //         authService.refreshToken();
    //     } else {
    //         /*console.log("_responseError reject");*/
    //         deferred.reject(rejection);
    //     }
    //     /*console.log("Deferred.promise for refreshToken");
    //      console.log(deferred.promise);*/
    //     return deferred.promise;
    // };
    return auth;
}

angular.module("playground").factory("authInterceptor", ["authStateService", authInterceptor]);
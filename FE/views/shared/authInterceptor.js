import {backendConfig} from "../../serverConfig"

export function authInterceptor($injector, $q, authStateService, requestBuffer) {
    var auth = {};

    auth.isApiRequest = function (config) {
        return config.url.indexOf(backendConfig.baseUrl()) == 0;
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
            }
            else {
                //explode or something
            }
        }
        return config
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
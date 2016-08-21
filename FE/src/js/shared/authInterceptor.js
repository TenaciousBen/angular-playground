import {backendConfig} from "../../../serverConfig"

export function authInterceptor($injector, $q, authStateService, requestBuffer) {
    var auth = {};

    auth.isApiRequest = function (config) {
        return config.url.indexOf("/api/") !== -1;
    };

    auth.request = function (config) {
        if (auth.isApiRequest(config)) {
            config.headers = config.headers || {};
            if (authStateService.hasToken()) {
                var authentication = authStateService.getToken();
                config.headers.Authorization = 'Bearer ' + authentication.accessToken;
            }
            else {
                console.log("Failed to add authorisation to request");
                console.log(config);
            }
        }
        return config
    };

    auth.responseError = function (rejection) {
        var deferred = $q.defer();

        if (!auth.hasRefreshed && rejection.status === 401 && auth.isApiRequest(rejection.config)) {
            var authService = $injector.get('accountService');
            requestBuffer.append(rejection.config, deferred);
            authService.refreshToken();
        } else {
            deferred.reject(rejection);
        }
        return deferred.promise;
    };
    return auth;
}
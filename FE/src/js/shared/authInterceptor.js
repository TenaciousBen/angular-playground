export function authInterceptor($injector, $q, authStateService) {
    var auth = {};

    auth.request = function (config) {
        config.headers = config.headers || {};
        if (authStateService.hasToken()) {
            var authentication = authStateService.getToken();
            config.headers.Authorization = 'Bearer ' + authentication.accessToken;
        }
        else {
            console.log("Failed to add authorisation to request");
            console.log(config);
        }
        return config
    };

    auth.responseError = function (rejection) {
        var deferred = $q.defer();
        if (rejection.status === 401) {
            var authService = $injector.get('accountService');
            authService.refreshToken(rejection.config);
        } else {
            deferred.reject(rejection);
        }
        return deferred.promise;
    };
    return auth;
}
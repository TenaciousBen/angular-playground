function requestBuffer($injector) {
    var requestBufferServiceFactory = {};

    var buffer = [];

    var _append = function(config, deferred) {
        /*console.log("_append function triggered");*/
        return buffer.push({
            config: config,
            deferred: deferred
        });
    };

    var _retryAll = function(configUpdater) {
        /* console.log("_retryAll function triggered");*/
        var updater = configUpdater || function(config) { return config; };
        for (var i = 0; i < buffer.length; ++i) {
            var _cfg = updater(buffer[i].config);
            if (_cfg !== false)
                _retryHttpRequest(_cfg, buffer[i].deferred);
        }
        buffer = [];
    };

    var _rejectAll = function(reason) {
        /*console.log("_rejectAll function triggered");*/
        for (var i = 0; i < buffer.length; ++i) {
            buffer[i].deferred.reject(reason || "");
        }
        buffer = [];
    };

    var _retryHttpRequest = function(config, deferred) {
        /*console.log("_retryHttpRequest function triggered");*/
        var $http = $injector.get('$http');
        $http(config).then(function(response) {
            deferred.resolve(response);
        }, function(response) {
            deferred.reject(response);
        });
    };

    requestBufferServiceFactory.append = _append;
    requestBufferServiceFactory.retryAll = _retryAll;
    requestBufferServiceFactory.rejectAll = _rejectAll;

    return requestBufferServiceFactory;
}

angular.module("playground").factory('requestBuffer', ['$injector', requestBuffer]);
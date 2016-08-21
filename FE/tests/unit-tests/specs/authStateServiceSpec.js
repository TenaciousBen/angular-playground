require("angular");
require("angular-mocks");
require("../../../src/js/app");

var authStateService;
var inject = angular.mock.inject;
var module = angular.mock.module;
var storage = {
    stored: {},
    put: function (key, item) {
        storage.stored[key] = item;
    },
    get: function (key) {
        return storage.stored[key];
    }
};

describe("AuthStateService", function () {

    beforeEach(function () {
        module("playground");
        module(function ($urlRouterProvider) {
            $urlRouterProvider.deferIntercept();
        });

        module(function ($provide) {
            $provide.value("$cookies", storage);
        });

        inject(function (_authStateService_){
            authStateService = _authStateService_;
        });
    });

    it("should be able to store auth, get auth and determine if auth is stored", function () {
        var username = "test", access_token = "access", refresh_token = "refresh";
        expect(authStateService.hasToken()).toBe(false);
        expect(authStateService.getToken()).toBe(null);
        authStateService.setToken(username, access_token, refresh_token);
        expect(authStateService.hasToken()).toBe(true);
        var token = authStateService.getToken();
        expect(token.userName).toBe(username);
        expect(token.accessToken).toBe(access_token);
        expect(token.refreshToken).toBe(refresh_token);
        authStateService.deleteToken();
        expect(authStateService.hasToken()).toBe(false);
        expect(authStateService.getToken()).toBe(null);
    });
});
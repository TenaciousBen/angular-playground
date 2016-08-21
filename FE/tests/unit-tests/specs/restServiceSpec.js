import {MockedRestService, MockedViewModel, MockedApiModel} from "../mocks/MockedRestService";
require("angular");
require("angular-mocks");
require("../../../src/js/app");

var $httpBackend, $http, $q, $rootScope, authStateService;
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

describe("REST service", function () {

    beforeEach(function () {
        module("playground");
        module(function ($urlRouterProvider) {
            $urlRouterProvider.deferIntercept();
        });

        module(function ($provide) {
            $provide.value("$cookies", storage);
        });

        inject(function (_$httpBackend_, _$http_, _$q_, _$rootScope_, _authStateService_) {
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            authStateService = _authStateService_;
        });
    });

    it("should be able to process a get request for a specific id", function (done) {
        authStateService.setToken("foo", "access", "refresh");
        var mockedService = new MockedRestService($http, $q);
        var id = 1, name = "foo";
        $httpBackend.whenGET(mockedService.apiUrl + "?id=" + 1)
            .respond(function (method, url, data, headers, params) {
                expect(params.id).toBe(id.toString());
                var viewModel = new MockedApiModel(parseInt(id), name);
                return [200, viewModel];
            });
        mockedService.get(id)
            .then(function (viewModels) {
                expect(viewModels.length).toBe(1);
                expect(viewModels[0].id).toBe(id);
                expect(viewModels[0].name).toBe(name);
                done();
            });
        $httpBackend.flush();
    });
});
"use strict";
/**
* @module   portfolio.about
* @author   Andrew Warren
*/
angular.module("portfolio.about", [])

/**
* @constructor
* @class aboutCtrl
* @param {Object} $scope
*/
.controller("aboutCtrl", [
    "$scope",
    "$rootScope",
    "$log",
    "APIResource",
    function ($scope, $rootScope, $log, APIResource) {

        $scope.getAboutSuccess = function getAboutSuccess(res){
            $scope.background = res.results[0].background;
            $rootScope.position = res.results[0].position;

        };

        $scope.getAboutError = function getAboutError(err){
            $log.error(err);
        };

        APIResource.getAbout($scope.getAboutSuccess, $scope.getAboutError);

    }
])

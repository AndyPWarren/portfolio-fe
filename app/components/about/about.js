"use strict";
/**
* @module   portfolio.about
* @author   Andrew Warren
*/
angular.module("portfolio.about", [

])

/**
* @constructor
* @class aboutCtrl
* @param {Object} $scope
*/
.controller("aboutCtrl", [
    "$scope",
    "$log",
    "APIResource",
    function ($scope, $log, APIResource) {

        $scope.getAboutSuccess = function getAboutSuccess(res){
            console.log(res);
            $scope.background = res.results[0].background;

        };

        $scope.getAboutError = function getAboutError(err){
            $log.error(err);
        };

        APIResource.getAbout($scope.getAboutSuccess, $scope.getAboutError)

    }
])

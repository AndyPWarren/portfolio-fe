"use strict";
/**
*
* @module   portfolio.experience
* @author
*/
angular.module("portfolio.experience", [

])

/**
* @constructor
* @class experienceCtrl
* @param {Object} $scope
*/
.controller("experienceCtrl", [
    "$scope",
    "$log",
    "APIResource",
    function ($scope, $log, APIResource) {

        $scope.getExperienceSuccess = function getExperienceSuccess(res){
            console.log(res);
            $scope.experiences = res.results;
        };

        $scope.getExperienceError = function getExperienceError(err){
            $log.error(err)
        };

        APIResource.getExperiences($scope.getExperienceSuccess, $scope.getExperienceError);

    }
])

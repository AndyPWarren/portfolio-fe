"use strict";
/**
*
* @module   portfolio.projets
* @author
*/
angular.module("portfolio.projects", [])

/**
* @constructor
* @class projectsCtrl
* @param {Object} $scope
*/
.controller("projectsCtrl", [
    "$scope",
    "$log",
    "APIResource",
    function ($scope, $log, APIResource) {

        $scope.getProjectSuccess = function getProjectSuccess(res){
            $scope.projects = res.results;
        };

        $scope.getProjectsError = function getProjectsError(err){
            $log.error(err);
        };

        APIResource.getProjects($scope.getProjectSuccess, $scope.getProjectsError);
    }
])

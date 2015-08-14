"use strict";
/**
*
* @module   portfolio.footer
* @author
*/
angular.module("portfolio.footer", [])

/**
* @constructor
* @class footerCtrl
* @param {Object} $scope
*/
.controller("footerCtrl", [
    "$scope",
    function ($scope) {
        var date = new Date();
        $scope.year = date.getFullYear();
    }
])

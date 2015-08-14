"use strict";
/**
 * @module   aucuparia
 * @main     aucuparia
 * @author   SpectraKey
 */
angular.module("portfolio", [
    "config",
    "ui.bootstrap",
    "portfolio.api",
    "portfolio.about",
    "portfolio.projects",
    "portfolio.experience"


])
/**
 * @method config
 * @param  {Service} $locationProvider
 */
.config([
    function () {

    }
]);

"use strict";
/**
 * @module   aucuparia
 * @main     aucuparia
 * @author   SpectraKey
 */
angular.module("portfolio", [
    "config",
    "ui.bootstrap",
    "ngSanitize",
    "ngMessages",
    "portfolio.api",
    "portfolio.about",
    "portfolio.projects",
    "portfolio.experience",
    "portfolio.contact",
    "portfolio.footer"
])
/**
 * @method config
 * @param  {Service} $locationProvider
 */
.config([
    function () {

    }
]);

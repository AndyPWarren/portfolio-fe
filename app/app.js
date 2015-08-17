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
    "duScroll",
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
])

.run([
    "$rootScope",
    "$window",
    function ($rootScope, $window) {
        $rootScope.$on('duScrollspy:becameActive', function($event, $element){
            //Automaticly update location
            var hash = $element.prop('hash');
            if (hash) {
                history.replaceState(null, null, hash);
            }
            console.log($element);
            //$rootScope.section = "home";
            var section = hash.split('#')[1];
            $rootScope.section = section;
            $window.document.title = section + " | Andrew Warren"
            $rootScope.$digest();
        });
    }
]);

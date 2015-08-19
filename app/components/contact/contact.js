"use strict";
/**
*
* @module   portfolio.contact
* @author
*/
angular.module("portfolio.contact", [])

/**
* @constructor
* @class contactCtrl
* @param {Object} $scope
*/
.controller("contactCtrl", [
    "$scope",
    "$rootScope",
    "$log",
    "APIResource",
    "$interval",
    function ($scope, $rootScope, $log, APIResource, $interval) {

        $scope.sendMessageSuccess = function sendMessageSuccess(res){
            $rootScope.submitting = false;
            $rootScope.success = true;
            var removeSuccess = $interval(function() {
                delete $rootScope.success;
                delete $rootScope.submitting;
                $interval.cancel(removeSuccess);
            }, 3000)

        };

        $scope.sendMessageError = function sendMessageError(err){
            $log.error(err);
            $rootScope.submitting = false;
            $rootScope.success = false;
            var removeError = $interval(function() {
                delete $rootScope.success;
                delete $rootScope.submitting;
                $interval.cancel(removeError);
            }, 3000)
        };

        $scope.submit = function submit(){
            $rootScope.submitting = true;
            var message = {
                message: $scope.form.message + "\n\n" + $scope.form.name,
                sender: $scope.form.email
            };
            if ($scope.form.subject) {
                message.subject = "message from andrewpwarren.co.uk: " + $scope.form.subject;
            } else {
                message.subject = "message from andrewpwarren.co.uk"
            }

            APIResource.sendMessage(message, $scope.sendMessageSuccess, $scope.sendMessageError);
        };

    }
]);

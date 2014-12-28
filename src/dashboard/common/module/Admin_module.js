/**
 * AdminService serves to make sure the admin is actually the admin.
 *
 */
angular.module('Admin', [])
    .factory('AdminService', ['$http', function($http){

        var AdminService = {};

        AdminService.user = undefined;


        AdminService.set = function (param) {

        }

        AdminService.setSession = function (timing) {

        }
        AdminService.get = function(){
            return AdminService.user;
        }

        return AdminService;

    }])

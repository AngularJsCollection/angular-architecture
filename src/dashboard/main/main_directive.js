angular.module('dashboard')
    .directive('header', function(){
        return {
            restrict : 'E',
            templateUrl : 'main/header/header.htm'
        }
    })
    .directive('sidebar', function () {
        return {
            restrict : 'E',
            templateUrl : 'main/sidebar/sidebar.htm'
        }
    })
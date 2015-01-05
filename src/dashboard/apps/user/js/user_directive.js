angular.module('dashboard.user')
    .directive('tableTemplate', function(){
        return {
            restrict: 'E',
            templateUrl: 'apps/user/template/table_template.htm'
        }
    })
    .directive('filterTemplate', function(){
        return {
            restrict: 'E',
            templateUrl: 'apps/user/template/filter_template.htm'
        }
    })
    .directive('userTitle', function () {
        return {
            restrict: 'E',
            templateUrl: 'apps/user/template/user_title_template.htm'
        }
    })
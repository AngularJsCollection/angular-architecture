var app = angular.module('dashboard', ['ui.router', 'oc.lazyLoad'])
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.when("/", "/stats/table");

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('dashboard', {
                abstract: true,
                url: '/',
                template: "<div ui-view></div>",
                controller: 'MainCtrl',
                resolve: {
                    modules : function($ocLazyLoad){
                        return $ocLazyLoad.load({
                            name: "dashboard",
                            files: ['common/factory/array_factory.js']
                        });
                    }
                }
            })
            .state('dashboard.stats', {
                url: 'stats',
                abstract: true,
                template: '<div ui-view></div>',
                controller: 'StatsCtrl',
                resolve: {
                    ctrl : function($ocLazyLoad){
                        return $ocLazyLoad.load({
                            name : "dashboard.stats",
                            files : ['apps/stats/stats_controller.js', 'apps/stats/graph/ng-google-chart.js', 'apps/stats/table/style/stats.css']
                        });
                    },
                    DrawObj: function(){
                        return { chartType : undefined };
                    }
                }
            })
            .state('dashboard.stats.table', {
                controller: 'StatsCtrl',
                templateUrl: 'apps/stats/table/template/stats.htm',
                url : '/table',
                resolve: {
                    DrawObj: function(){
                        return { chartType : 'table' };
                    }
                }
            })
            .state('dashboard.stats.graph', {
                controller: 'StatsCtrl',
                templateUrl: 'apps/stats/graph/template/graph_template.htm',
                url : '/graph/:graphType',
                resolve: {
                    DrawObj:  function($http, $stateParams){
                        var obj = { chartType : 'graph' };
                        var type = $stateParams.graphType;
                        obj.graphType = $stateParams.graphType;
                        return obj;
                    }
                }
            })
            .state('dashboard.sendpush', {
                templateUrl : 'apps/sendpush/template/sendpush_template.htm',
                controller : 'SendpushCtrl',
                url : 'sendpush/:uid',
                resolve: {
                    ctrl : function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: "dashboard.sendpush",
                            files: ['apps/sendpush/sendpush_controller.js']
                        });
                    },
                    uid : function($stateParams){
                        return $stateParams.uid;
                    }
                }
            })
            .state('dashboard.location', {
                templateUrl : "apps/location/template/location_template.htm",
                controller: 'LocationCtrl',
                url: "location/:lid",
                resolve: {
                    ctrl: function($ocLazyLoad){
                        return $ocLazyLoad.load({
                            name: "dashboard.location",
                            files: ['apps/location/location_controller.js', 'apps/location/style/location.css']
                        });
                    },
                    lid: function($stateParams){
                        return $stateParams.lid;
                    }
                }
            })
    })
    .controller('MainCtrl', ['$scope', '$filter', function($scope, $filter){

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            // TODO Error Handling
        });
        $scope.$on('$stateChangeStart', function(ev, toSt, toPrm, frmSt, frmPrm){
           // TODO Log User Interaction
        })
        $scope.$on('$stateNotFound ',function(event, unfoundState, fromState, fromParams){
            // TODO Error Handling
        })

        $scope.$on('onChangeLoadingState', function(event, data){
            $scope.isLoading = data;
            // TODO change this to UI Handler
        })

        $scope.$on('onError', function(event, data){
            // TODO error handling factory needed
            $scope.showError = data.isError;
            $scope.errorMessage = data.errorMessage;
        })

        $scope.sideMenu = [];
        $scope.sideMenu.push({ state : 'dashboard.stats.table', label : 'Stats', icon : 'fa fa-area-chart'});
        $scope.sideMenu.push({ state : 'dashboard.sendpush', label : 'Send Push', icon : 'fa fa-comment-o'});
        $scope.sideMenu.push({ state : 'dashboard.location', label : 'Locations', icon : 'fa fa-location-arrow'});


    }]);


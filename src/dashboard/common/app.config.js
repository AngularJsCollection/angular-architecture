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
                    dashboard : function($ocLazyLoad){
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
            .state('dashboard.user', {
                templateUrl : 'apps/user/template/user_template.htm',
                controller : 'UserCtrl',
                url : 'user/:uid',
                resolve: {
                    ctrl : function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: "dashboard.user",
                            files: ['apps/user/user_controller.js','apps/user/js/user_directive.js', 'apps/user/style/user_style.css']
                        });
                    },
                    uid : ['$stateParams','ctrl', function($stateParams, ctrl){
                        return $stateParams.uid;
                    }]
                }
            })
            .state('dashboard.location', {
                templateUrl : "apps/location/template/location_template.htm",
                controller: 'LocationCtrl',
                url: "location/:lid/:name",
                resolve: {
                    ctrl: function($ocLazyLoad){
                        return $ocLazyLoad.load({
                            name: "dashboard.location",
                            files: ['apps/location/location_controller.js', 'apps/location/style/location.css']
                        });
                    },
                    lid: function($stateParams){
                        $stateParams.lid = $stateParams.lid || 'all';

                        return $stateParams.lid;
                    },
                    getName: ['$q','$timeout', function($q, $timeout){
                        var deferred = $q.defer();
                        $timeout(function() {
                            var names = ['Cool Place', 'Awesome place', 'boring place', 'I want to be here', 'Random Venue'];
                            deferred.resolve(names[ Math.round(Math.random()*4) ]);
                        }, 100);
                        return deferred.promise;
                    }],
                    name : ['lid', '$state','$stateParams','getName', function (lid, $state, $stateParams,getName) {

                        if($stateParams.lid.length < 1 || $stateParams.lid == 'all'){ // show all or not set Location ID
                            $stateParams.name = '';
                            return '';
                        }
                        if($stateParams.name.length > 0){ // if the name is already specified, it's ok. settle
                            return $stateParams.name;
                        }

                        // hyphens are better than %20 in the url
                        getName = getName.replace(/\s/g,'-');

                        $state.transitionTo('dashboard.location', {lid:lid, name:getName}, {
                            reload:true,
                            inherit:false,
                            notify:true
                        })
                    }]
                }
            })
            .state('dashboard.notification', {
                templateUrl: "apps/notification/template/notification_template.htm",
                controller: 'NotificationCtrl',
                url: "notification",
                resolve:{

                }
            })
    })
    .controller('MainCtrl', ['$scope', '$filter', 'LoadingManager', function($scope, $filter, Loading){
        $scope.$on('$stateChangeStart', function () {
            Loading.start($scope);
        })
        $scope.$on('$stateChangeError', function () {
            Loading.stop($scope.$id);
        })
        $scope.$on('$stateNotFound', function () {
            Loading.stop($scope.$id);
        })
        $scope.$on('$stateChangeSuccess', function () {
            Loading.stop($scope.$id);
        })

        $scope.$watch(function(){
            return Loading.isLoading();
        }, function(newVal){
            $scope.isLoading = newVal;
        }, true);

        $scope.$on('onError', function(event, data){
            Loading.stop($scope.$id);
            // TODO error handling factory needed
            $scope.showError = data.isError;
            $scope.errorMessage = data.errorMessage;
        })

        $scope.sideMenu = [];
        $scope.sideMenu.push({ state : 'dashboard.stats.table', label : 'Stats', icon : 'fa fa-area-chart'});
        $scope.sideMenu.push({ state : 'dashboard.user', label : 'Users', icon : 'fa fa-comment-o'});
        $scope.sideMenu.push({ state : 'dashboard.location', label : 'Locations', icon : 'fa fa-location-arrow'});
      //  $scope.sideMenu.push({ state : 'dashboard.notification', label : ' Notification', icon : 'fa fa-exclamation'});


    }]);


angular.module('dashboard.location', [])
    .controller('LocationCtrl', ['$scope', '$http', '$q','lid', '$filter', 'LoadingManager', function($scope, $http, $q, LID, $filter, Loading){
// TODO - Control Responsiveness with Cache

        // specific UID data will be in .active
        $scope.active = {};

        // LID injected and may be defined from $stateProvider
        if(typeof LID != 'undefined' && LID != '' && LID != 'all'){ // LID is defined
            $scope.loadLid = true;

            fetchLocationData(LID).then(function(successData, status, header, config){
                $scope.active.data = successData.data;
                Loading.stop($scope.$id);
            }, function(faildata){
                Loading.stop($scope.$id);
            });

        }else{ // LID is not defined. show all locations
            $scope.loadLid = false;
            fetchLocationData().then(function(successData){
                $scope.locations = successData.data;
                Loading.stop($scope.$id);
            }, function(faildata){
                Loading.stop($scope.$id);
            })
        }

        /**
         * Get Location data and returns a promise
         * @returns { object } : promise
         */
        function fetchLocationData(lid){
            var query = '';
            if(lid) {query = 'apps/location/server/location_1234.json';  // obviously, this needs standarization for each lid and simplification
            }else{ query = 'apps/location/server/location.json'; }
            return $http.get(query);
        }

    }]);
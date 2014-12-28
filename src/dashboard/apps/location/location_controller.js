angular.module('dashboard.location', [])
    .controller('LocationCtrl', ['$scope', '$http', '$q','lid', '$filter', function($scope, $http, $q, LID, $filter){
// TODO - Control Responsiveness with Cache
        // table thead values
        $scope.locationHeader = ['Name', 'Address', 'Rating', 'Action'];

        // specific UID data will be in .active
        $scope.active = {};

        // LID injected and may be defined from $stateProvider
        if(typeof LID != 'undefined' && LID != ''){ // LID is defined
            $scope.loadLid = true;
            fetchLocationData(LID).then(function(successData, status, header, config){
                $scope.active.data = successData.data;
                $scope.$emit('onChangeLoadingState', false);
            });
        }else{ // LID is not defined. show all locations
            $scope.loadLid = false;
            fetchLocationData().then(function(successData){
                $scope.locations = successData.data;
                $scope.$emit('onChangeLoadingState', false);
            })
        }

        /**
         * Get Location data and returns a promise
         * @returns { object } : promise
         */
        function fetchLocationData(lid){
            $scope.$emit('onChangeLoadingState', true);
            var query = '';
            if(lid) {query = 'apps/location/server/location_1234.json';  // obviously, this needs standarization for each lid and simplification
            }else{ query = 'apps/location/server/location.json'; }
            return $http.get(query);
        }

    }]);
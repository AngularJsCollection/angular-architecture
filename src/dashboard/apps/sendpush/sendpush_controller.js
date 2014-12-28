angular.module('dashboard.sendpush', [])
    .controller('SendpushCtrl', ['$scope', '$http', '$filter', 'uid', function($scope, $http, $filter, UID){

        if(typeof UID != 'undefined' && UID != ''){ // get specific user profile
            $scope.uidIsLoaded = true;
            $scope.active = {};

            if(typeof $scope.profiles == 'undefined'){ // if profile data is not loaded yet, fetch
                fetchProfile().then(function(successData){
                    $scope.profiles = successData.data;
                    $scope.profiles.forEach(function (e) {
                        if (e.loginid == UID) {
                            $scope.active.data = e;
                            return;
                        }
                    })
                    getSpecificUserData(UID);
                })
            }else { // profile data is already loaded. find the specific user data from there.
                $scope.profiles.forEach(function (e, i, o) {
                    if (e.loginid == UID) {
                        $scope.active.data = o;
                        return;
                    }
                })
                getSpecificUserData(UID);
            }
        }else{ // the UID is not defined. Fetch profiles and show all
            $scope.uidIsLoaded = false;
            fetchProfile().then(function(successData){
                $scope.profiles = successData.data;
            })
        }

        /**
         * Profile Table Header Values
         */
        $scope.profiles = [];
        $scope.profileHeader   = [];
        $scope.profileHeader.push({label: 'Selected', key: 'select-all'});
        $scope.profileHeader.push({label: 'Image', key: 'loginid'});
        $scope.profileHeader.push({label: 'First Name', key: 'fname'});
        $scope.profileHeader.push({label: 'Last Name', key: 'lname'});
        $scope.profileHeader.push({label: 'Last Active', key: 'lastActiveTime'});
        $scope.profileHeader.push({label: 'Distance', key: 'distance'});
        $scope.profileHeader.push({label: 'Has DeviceToken', key: 'deviceToken'});


        $scope.changeFilter = function(key){
            if($scope.searchKeyword == key){ $scope.searchReverse = !$scope.searchReverse; }
            $scope.searchKeyword = key;
        }

        function fetchProfile(uid){
            if(typeof uid != 'undefined') return $http.get('apps/sendpush/server/profile_1234.json');
            return $http.get('apps/sendpush/server/profile.json');
        }

        function getSpecificUserData(UID){
            fetchProfile(UID).then(function(specificData){
                for(var key in specificData.data){
                    $scope.active.data[key] = specificData.data[key];
                }
            })
        }
    }]);
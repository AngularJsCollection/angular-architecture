angular.module('dashboard.user', [])
    .controller('UserCtrl', ['$scope', '$http', '$filter', 'uid', 'LoadingManager', 'FilterManager', function($scope, $http, $filter, UID, Loading, FilterManager){

        if(typeof UID != 'undefined' && UID != '' && UID != 'all'){ // get specific user profile
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
                    Loading.stop($scope.$id);
                    FilterManager.init($scope.profiles, true);
                })
            }else { // profile data is already loaded. find the specific user data from there.
                $scope.profiles.forEach(function (e, i, o) {
                    if (e.loginid == UID) {
                        $scope.active.data = o;
                        return;
                    }
                })
                getSpecificUserData(UID);
                Loading.stop($scope.$id);
            }
        }else{ // the UID is not defined. Fetch profiles and show all
            $scope.uidIsLoaded = false;
            fetchProfile().then(function(successData){
                $scope.Filters.data = successData.data;
                FilterManager.init($scope.Filters.data, true);
                FilterManager.setHeader($scope.filterKeys);
                $scope.Filters.operators = FilterManager.operators;

            })
        }

        /**
         * Profile Table Header Values
         */
        $scope.potentialfilter = {};
        $scope.potentialfilter.label = 'Distance';
        $scope.potentialfilter.labelkey = 'distance';
        $scope.potentialfilter.operator = 'is less than';
        $scope.potentialfilter.operatorkey = '<';
        $scope.potentialfilter.postFix = 'miles';

        $scope.Filters = {};

        $scope.filterKeys   = [];
        $scope.filterKeys.push({label: 'Gender',   key: 'gender', postFix:'', convertFn:'genderFmt'});
        $scope.filterKeys.push({label: 'Distance',   key: 'distance', postFix:'miles', convertFn:'firstVal'});
        $scope.filterKeys.push({label: 'Last Active',key: 'lastActiveTime', postFix:'days', flipOperator:true, convertFn: 'timeDifferenceBack'});
        $scope.filterKeys.push({label: 'Device Token',key: 'deviceToken', postFix:'', convertFn: 'firstVal'});

        $scope.currentFilters = [];

        $scope.changeFilter = function(key){
            if($scope.searchKeyword == key){ $scope.searchReverse = !$scope.searchReverse; }
            $scope.searchKeyword = key;
        }

        /**
         * Add filter
         * @param variableKey : key to be used from objects within $scope.filterKeys above
         * @param variableLabel: label to be shown to users for key
         * @param operatorKey: operator key such as "<",">","==","<=" refer Readme.md
         * @param operatorLabel: label shown to uses such as " greater than "
         * @param value : value to be compared against
         *
         * Example : $scope.addFilter('distance','Distance','<','less than',30) will filter data that has property
         * obj.distance of less than 30 and users will see "Distance is less than 30"
         */
        $scope.addFilter = function(variableKey, variableLabel, operatorKey, operatorLabel, value){
            FilterManager.addFilter(variableKey, variableLabel, operatorKey, operatorLabel, value);
        }

        /**
         * Remove filter
         * @param uid : id craeted when addFilter did not return false
         * Use the filter object's property, uid.
         */
        $scope.removeFilter = function(uid){ FilterManager.removeFilterById(uid); }

        $scope.toggleShown = function(show){
            $scope.Filters.data.forEach(function (e) { if(e.$_show) e.$_selected = show;  })
            $scope.recountSelected();
        }

        $scope.deleteSelected = function(){
            $scope.Filters.data.forEach(function (e,i,o) { if(e.$_selected){o.splice(i,1);} })
            $scope.recountSelected();
        }

        $scope.selectedCount = 0;

        $scope.recountSelected = function(){
            var total = 0;
            $scope.Filters.data.forEach(function (e) {
                if(e.$_selected) total++;
            })
            $scope.selectedCount = total;
        }

        
        function fetchProfile(uid){
            if(typeof uid != 'undefined') return $http.get('apps/user/server/profile_1234.json');
            return $http.get('apps/user/server/profile.json');
        }

        function getSpecificUserData(UID){
            fetchProfile(UID).then(function(specificData){
                for(var key in specificData.data){
                    $scope.active.data[key] = specificData.data[key];
                }
            })
        }

        /**
         * Watch the filter result count
         */
        $scope.$watch(function(){
            return FilterManager.visibleCount;
        }, function(newVal){
            $scope.visibleCount = newVal;
        }, true);

        /**
         * Watch Current Applied Filter list
         */
        $scope.$watch(function(){
            return FilterManager.current;
        }, function(newCurrent){
            $scope.currentFilters = newCurrent;
        }, true);


    }])

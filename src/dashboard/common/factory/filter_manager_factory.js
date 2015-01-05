/**
 * Manages filters of dataset
 * Assumptions : Filter Manager assumes the data set to be an array of objects
 */
angular.module('dashboard')
    .factory('FilterManager', ['OperatorService', '$filter', function (Operator, $filter) {

        var FilterManager = {};
        FilterManager.current = [];
        FilterManager.visibleCount = 0;
        FilterManager.operators = [];
        /**
         * Initialize Filter Manager with data
         * @param arr
         */
        FilterManager.init = function(arr, show){
            FilterManager.data = arr;
            if(show) {
                initOperators();
                FilterManager.data.forEach(function (e) { e.$_show = true;  });
                FilterManager.resetVisibleCount();
            }
        }

        /**
         * Initialiate Operators. This must be called to start using the service
         */
        var initOperators = function(){
            FilterManager.operators = [];
            FilterManager.operators.push({label : 'is equal to', key : '=='});
            FilterManager.operators.push({label : 'is not equal to', key : '!='});
            FilterManager.operators.push({label : 'is greater than', key : '>'});
            FilterManager.operators.push({label : 'is greater than or equal to ', key : '>='});
            FilterManager.operators.push({label : 'is less than', key : '<'});
            FilterManager.operators.push({label : 'is less than or equal to', key : '<='});
            FilterManager.operators.push({label : 'exists', key : 'exist'});
            FilterManager.operators.push({label : 'does not exists', key : 'no-exist'});
        }

        /**
         * Set Header
         */
        FilterManager.setHeader = function(data){
            FilterManager.headers = data;
        }
        /**
         * Reset Visible Count
         * @returns {number}
         *
         */
        FilterManager.resetVisibleCount = function(){
            var total = 0;
            FilterManager.data.forEach(function (e) {
                if(e.$_show)total++;
            })
            FilterManager.visibleCount = total;
            return total;
        }

        /**
         * Conver to Filter Function.
         * Example : When adding a filter 'last active less than 1 hour', this needs to be converted to '3600'
         * so that it can be compared for filteration. $filter is used for this filteration.
         * In this case, set a property, convertFn, of an object within the header to 'timeToSeconds' to be filtered correctly.
         * @param variableKey
         * @returns {*}
         */
        var convertToFilterValue = function(variableKey, value){
            var fn;
            var obj = {};
            var flipOperator = false;

            FilterManager.headers.forEach(function (e) {
                if(e.key == variableKey){
                    if(e.flipOperator) { flipOperator = true; }
                    if(angular.isDefined(e.convertFn)){ fn = e.convertFn; }  return; }
            })
            if(!angular.isString(fn)){ return value; }
            obj.value = $filter(fn)(value);
            obj.flipOperator = flipOperator;
            return obj;
        }

        /**
         * Add Filter
         * Notes : Add filter will make $_show = false whenever the condition is not met
         * but the converse is not true. (i.e. meeting conditions will not make $_show = true)
         * @param { string } variable : variable in the object to get the current value
         * @param { string } operator : operator that acts upon the value
         * @param { mixed } value : the value to be compared against
         * @return { mixed } undefined for duplicate, integer (uid) for success
         */
        FilterManager.addFilter = function(variable, variableLabel, operator, operatorLabel, oldVal, filterFn){

            var fil_obj = convertToFilterValue(variable, oldVal);

            value = fil_obj.value;

            var obj = {};

            if(checkFilterExistsOnList(variable, operator, value) !== false){ return false;  }

            var uid = generateCurrenListUID();

            obj.uid = uid;
            var operatorObj = Operator.getOperation(operator, fil_obj.flipOperator);

            if(angular.isUndefined(operatorObj)) throw "Invalid Operator";

            var matchCount = addToFilterAppliedFields(operatorObj, variable, uid);

            FilterManager.resetVisibleCount();

            addFilterToList(uid, variable, variableLabel, operator, operatorLabel, oldVal, matchCount);
            obj.matchCount = matchCount + '/'+ FilterManager.data.length;
            return obj;
        }

        /**
         * Add the specific uid to the object so that we know which filteration is causing the object to hide
         * @param operatorObj
         * @param variable
         * @param uid
         * @returns {number} matchCount
         */
        var addToFilterAppliedFields = function(operatorObj, variable, uid){

            var matchCount = 0;

            FilterManager.data.forEach(function (e) {
                // if operator function does not match, do not show.
                if(!Operator[operatorObj.fn](e[variable], value, operatorObj.param)) {
                    e.$_show = false;
                    if(angular.isUndefined(e.$_appliedFilterIds)) {
                        e.$_appliedFilterIds = [];
                    }
                    if(e.$_appliedFilterIds.indexOf(uid) < 0){
                        e.$_appliedFilterIds.push(uid); // add a uid filter
                    }
                }else{
                    matchCount++;
                }
            })

            return matchCount;
        }
        /**
         * Removes Filter from the list
         * @param uid : Unique Identifier of the filter object
         */
        FilterManager.removeFilterById = function(uid){
            // get current object
            var obj = checkFilterExistsById(uid);

            // get operator
            if(obj !== false){
                // does  exist
                FilterManager.data.forEach(function (e) {
                    // check if this uid was used for hiding this object
                    var filterids = e.$_appliedFilterIds;
                    if(angular.isDefined(filterids)) {
                        var idx = filterids.indexOf(uid);
                        if (idx > -1) { // this was the uid that made this hide.
                            filterids.splice(idx, 1);
                                if (filterids.length < 1) { // no more hiding factors. show this now.
                                    e.$_show = true;
                                }
                        }
                    }
                })
            }
            FilterManager.resetVisibleCount();
            return doRemoveFilterFromPrivateList(uid);
        }


            /**
         * Add Filter to the private list
         * @param variable : variable passed on by FilterManager.addFilter @param : filter
         * @param operator : operator passed on by FilterManager.addFilter @param : operator
         * @param value : value passed on by FilterManager.addFilter @param : value
         * @return { integer } _uid : UID of the filter
         */
        var addFilterToList = function(_uid, variableKey, variableLabel, operatorKey, operatorLabel, value, matchCount){
            FilterManager.current.unshift({ uid : _uid, matchCount : matchCount, variable: variableKey, variableLabel: variableLabel, operator:operatorKey, operatorLabel: operatorLabel, value:value})
            }

        /**
         * Generate UID for private list object
         * @returns {number}
         */
        var generateCurrenListUID = function(){
            var i = 1;
            while(checkFilterExistsById(i) !== false && i < 500){ i++; }
            return i;
        }

        /**
         * Check whether the filter already exists privately
         * @param variable : variable passed on by FilterManager.addFilter @param : filter
         * @param operator : operator passed on by FilterManager.addFilter @param : operator
         * @param value : value passed on by FilterManager.addFilter @param : value
         * @returns {boolean}
         */
        var checkFilterExistsOnList = function(variable, operator, value){
            var exists = false;
            var obj = undefined;
            FilterManager.current.forEach(function (e) {
                if(e.variable == variable && e.operator == operator && e.value == value){
                    exists = true; obj = e; return;
                }
            })
            return exists ? obj : false;
        }

        /**
         * Check Filter Exists by Private List Object UID
         * @param id
         * @returns {mixed} : returns false if does not exist. returns filter obj for true
         */
        var checkFilterExistsById = function(id){
            var exists = false;
            var obj = undefined;
            FilterManager.current.forEach(function (e) {
                if(e.uid == id){  exists = true; obj = e; return;  }
            })

            return exists ? obj : false;
        }

        /**
         * Remove Filter by private list UID
         * @param id
         * @return { boolean } removed : Whether removed or not.
         */
        var doRemoveFilterFromPrivateList = function(id){
            var removed = false;
            FilterManager.current.forEach(function (e, i, o) {
                if(e.uid == id){ o.splice(i, 1); removed = true; }
            })
            return removed;
        }


        return FilterManager;
    }])
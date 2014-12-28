angular.module('dashboard')
    .factory('ArrayService', function () {
        var ArrayService = {};

        /**
         * Converts an object value to another object
         * @param { array } arr : array to be used
         * @param { string } fromVar : object key to be used
         * @param { mixed } fromVarVal : object value to be compared to
         * @param { string } toVar : object key of the value that gets outputted
         * @return { mixed } out : matched identifier value. It may be undefined
         *
         * Example:
         * Let arr = [{ label : 'taku', uid : 23342}, { label : 'jon', uid : 9182}]
         * fromVar = 'uid'
         * fromVarVal = 23342
         * toVar = 'label'
         * output should be  'taku'
         */
        ArrayService.convertObjectValue = function(arr, fromVar, fromVarVal, toVar){
            if(typeof arr == 'undefined' || arr.length < 1) throw "Array is undefined or empty";
            
            var out = undefined;
            arr.forEach(function (e) {
                if(e[fromVar] == fromVarVal){ out = e[toVar]; return;}
            })
            return out;
        }

        return ArrayService;
    })
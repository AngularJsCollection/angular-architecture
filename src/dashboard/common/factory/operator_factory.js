/**
 * Operator factory. Determines the operation
 **/

angular.module('dashboard')
        .factory('OperatorService', function(){

        var OperatorService = {};

        /**
         * Get Operation from operand string
         * @param operator
         * @param flipOperator : Whether the operation will be flipped such as time
         * @returns { object } obj : object of callback function name and parametres
         */
        OperatorService.getOperation = function(operator, flipOp){
            var obj = {};
            if(flipOp) operator = flipOperator(operator);
            switch(operator){
                case '==':
                    obj.fn = 'isEqualTo';
                    break;

                case '===':
                    obj.fn = 'isEqualTo';
                    obj.param = true; // check for data type as well
                    break;

                case  '!=':
                    obj.fn = 'isNotEqualTo';
                    obj.param = false; // do not check for data type
                    break;

                case  '!==':
                    obj.fn = 'isNotEqualTo';
                    obj.param = true; // do not check for data type
                    break;

                case '<':
                    obj.fn = 'isLessThan';
                    obj.param = false; // do not check for equality
                    break;

                case '<=':
                    obj.fn = 'isLessThan';
                    obj.param = true; // check for equality as well
                    break;

                case '>':
                    obj.fn = 'isGreaterThan';
                    obj.param = false; // do not check for equality
                    break;

                case '>=':
                    obj.fn = 'isGreaterThan';
                    obj.param = true; // check for equality as well
                    break;

                case 'exist':
                    obj.fn = 'exists';
                    obj.param = true;
                    break;

                case 'no-exist':
                    obj.fn = 'exists';
                    obj.param = false;
                    break;


                default :
                    return  undefined;
            }
            return obj;
        }

        var flipOperator = function(operator){
            operator = operator.replace('>','<');
            operator = operator.replace('<','>');
            return operator;
        }

        /**
         * Determines whether two values are equal
         * @param leftVal
         * @param rightVal
         * @param checkDataType
         * @returns {boolean}
         */
        OperatorService.isEqualTo = function(leftVal, rightVal, checkDataType){
           return checkDataType ? angular.equals(leftVal,rightVal) : leftVal == rightVal;
        }

        /**
         * Compares whether two values are inequal
         * @param leftVal
         * @param rightVal
         * @param checkDataType
         * @returns {boolean}
         */
        OperatorService.isNotEqualTo = function (leftVal, rightVal, checkDataType) {
            return checkDataType ? !angular.equals(leftVal,rightVal) : leftVal != rightVal;
        }

        /**
         * Compares whether the left value is less than (or equal to) the right value
         * @param leftVal
         * @param rightVal
         * @param isEqualTo
         * @returns {boolean}
         */
        OperatorService.isLessThan = function(leftVal, rightVal, isEqualTo){
            return isEqualTo ? leftVal <= rightVal : leftVal < rightVal;
        }

        /**
         * Compares whether the right value is less than (or equal to) the left value
         * @param leftVal
         * @param rightVal
         * @param isEqualTo
         * @returns {boolean}
         */
        OperatorService.isGreaterThan = function (leftVal, rightVal, isEqualTo) {
            return isEqualTo ? leftVal >= rightVal : leftVal > rightVal;
        }

        /**
         * Whether the value exists, set, has length > 0
         * @param leftVal
         * @param rightVal
         * @param exist
         * @returns {*}
         */
        OperatorService.exists = function(leftVal, rightVal, exist){
            if(angular.isString(leftVal)){
                return exist ? leftVal.length > 0 : leftVal.length < 1;
            }
            if(angular.isNumber(leftVal)){
                return exist ? leftVal != 0 : leftVal == 0;
            }

            return exist ? angular.isDefined(leftVal) : angular.isUndefined(leftVal);
        }

        return OperatorService;

    });
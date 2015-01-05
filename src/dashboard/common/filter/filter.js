angular.module('ExampleApp')
/**
 * Formats seconds into user-friendly time format
 * Example
 * 5 => 5 seconds ago
 * 600 => 20 minutes ago
 * 3600 => 1 hour ago
 * Time will be rounded to the nearest whole number
 */
    .filter('timeFmt', function () {
        return function(seconds){
            if(seconds < 60){
                return seconds + ' seconds ago';
            }else {
                var val;
                var out;
                if (seconds < 3600) {
                    val = Math.round(seconds / 60);
                    out = ' minutes ago';
                } else if (seconds < 60 * 60 * 24) {
                    val = Math.round(seconds / 3600);
                    out = ' hours ago';
                } else {
                    val = Math.round(seconds / (60 * 60 * 24));
                    out = ' days ago';
                }
                if(val < 2){
                    out.replace('s', '');
                }
                return val + out;
            }
        }
    })
/**
 * Converts time format into seconds.
 * Example : 30 seconds => 30
 * Example : 10 minutes => 600
 * Example : 2 hours => 7200
 */
    .filter('timeToSeconds', function () {
        return function(time){
                var words = time.split(' ');

                if(time.indexOf('second') > -1){
                    return parseInt(words[0]);
                }else if(time.indexOf('minute') > -1){
                    return parseInt(words[0]) * 60;
                }else if(time.indexOf('hour') > -1){
                    return parseInt(words[0]) * 3600;
                }else if(time.indexOf('day')){
                    return parseInt(words[0]) * (60*60*24);
                }else{
                    return false;
                }
            }
    })
/**
 * Get the first value
 * Example : "10 degrees" => 10
 */
    .filter('firstVal', function () {
        return function(time){
            if(!angular.isString(time)) return time;
            var arr = time.split(' ');
            if(arr.length > 0){ return parseInt(arr[0]);  }
            return time;
        }
    })
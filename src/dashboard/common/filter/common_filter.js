angular.module('dashboard')
    .filter('timeDifference', function () {
        return function(time){
            // get now time
            // get the past time
            var now = Math.round(new Date().getTime()/1000);
            var diff = now - time;
            var output;
            if(diff < 60){
                output = diff + ' seconds';
            }else if(diff < 3600){
                output = Math.round(diff/60) + ' minutes';
            }else if(diff < 60*60*24){
                output = Math.round(diff/(60*60)) + ' hours';
            }else{
                output = Math.round(diff/(24*60*60)) + ' days';
            }
            return output + ' ago';
        }
    })
    .filter('numberFmt', function () {
        return function(number){
            if(number < 1000) return number;
            else if(number < 1000000) return Math.round(number*10/1000)/10 + 'K';
            else if(number < 1000000000) return Math.round(number*10/1000000)/10 + 'M';
        }
    })
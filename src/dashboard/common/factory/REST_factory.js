angular.module('dashboard')
    .factory('RESTService', ['$http',  function($http){

        var RESTService = {};
        RESTService.config = {};
        /**
         * Initialize REST Service
         */
        RESTService.init = function(){
            this.config.urls = [];
            this.config.urls.push({ url: 'http://www.example.com/errorlog/client', param: '200', statuscode:'200-299'});
            this.config.urls.push({ url: 'http://www.example.com/errorlog/client', param: '300', statuscode:'300-399'});
            this.config.urls.push({ url: 'http://www.example.com/errorlog/server', param: '400', statuscode:'400-499'});
        }

        RESTService.list = function(){
            return this.config.urls;
        }
        /**
         * Log Error. => submit error to server
         * @param { number }
         * @return { void }
         */
        RESTService.logError = function(data,status,headers,config){
            var obj = getObjFromStatus(status);
            var postData = {};
            postData.customParam = obj.param;
            postData.data = data;
            postData.headers = headers;
            postData.config = config;
            return $http.post(obj.url, postData);
        }

        /**
         * Get Object from status
         * @param { integer } status : status code of the response
         * @return { obj } an object of this.config.url
         */
        var getObjFromStatus = function(status){
            var output = undefined;
            console.log('get obj from status', this.config.urls);
            
            this.config.urls.forEach(function (e) {
                if(ifStatusIsInRange(status, e.statusCode)){  output = e; return; }
            })
            return output;
        }


        /**
         * Determines whether the status is within status code range
         * @param status : Status to check for
         * @param statusRange : Status range (if it's a range) to check against
         * @returns {boolean} : true/false for existance
         */
        var ifStatusIsInRange = function(status, statusRange){
            // if it has commas, separate it. 200,201,202 then separate it.
            var codes = statusRange.split(',');
            var inRange = false;
            if(codes.length > 1) {
                codes.forEach(function (e) {
                    if (e.indexOf('-') > -1) { // it's a range like 200-299
                        var range = e.split('-');
                        if (range.length > 2) throw "Invalid Range";
                        if (parseInt(range[0]) <= status && status < parseInt(range[1])) {
                            inRange = true;
                            return;
                        }
                    } else {  // not a range. just a number
                        if (parseInt(e) == status) {
                            inRange = true;
                            return;
                        }
                    }
                })
            }else{ inRange = (statusRange == status);}

            return inRange;
        }

        RESTService.init();
        return RESTService;

    }])
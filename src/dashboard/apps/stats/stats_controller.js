angular.module('dashboard.stats', ['googlechart'])
    .controller('StatsCtrl', ['$scope', '$http', '$q', 'DrawObj', 'GoogleChartService', function($scope, $http, $q, DrawObj, GoogleChart){

        //table thead portion
        $scope.headers = GoogleChart.getHeader();

        if( DrawObj.chartType == 'graph'){

            $scope.renderGraph(DrawObj.graphType);
            $scope.currentSelection = GoogleChart.convertHeaderObjectValue(DrawObj.graphType);
        }else if( typeof DrawObj.chartType == 'undefined' ||  DrawObj.chartType == 'table'){
            renderTable();
        }


        /**
         * Renders a table.
         * function renderTable() hoists the function to the top of this controller
         * whereas var renderTable = function() will not.
         * @param none
         * @return void
         */
        function renderTable(){
            fetchData().then(function(successData,status, header, config){
                $scope.tableData = successData.data;
                $scope.$emit('onChangeLoadingState', false);
                // TODO Handle Loading State as a from factory
            }, function(data, status, header, config){ // handle most errors by using status
                $scope.$emit('onError', {isError:true, errorMessage:{ data : data, status : status}});
                // TODO Create Error Handling Factory
            })
        }

        /**
         * Fetch data and returns a promise
         * @param  none
         * @returns { promise }
         */
        function fetchData(){
            $scope.$emit('onChangeLoadingState', true);
            return $http.get('apps/stats/common/server/getStats.json');
        }

        /**
         * Render Graph
         * @param yVar : key to be used for comparison
         * @param label : label to be used for display
         */
        $scope.renderGraph = function(yVar){
            if(typeof $scope.tableData == 'undefined'){
                fetchData().then(function(successData, status, header, config){
                    $scope.tableData = successData.data;
                    $scope.renderGraph(DrawObj.graphType);
                }); return;
            }

            if(typeof yVar == 'undefined' ||  yVar == '') yVar = 'totalUsers';

            var dat = $scope.tableData;

            $scope.chartObject = GoogleChart.set(dat).assemble(yVar).get();

            // TODO This should be a promise if the data set is large
            $scope.$emit('onChangeLoadingState', false);
        }

    }])

    .factory('GoogleChartService', ['ArrayService', function(ArrayService){

        var GoogleChartService = {};

        GoogleChartService.background = {};

        /**
         * Initialize the google chart service by keeping the data here
         * @param { array } data
         * @return { void } : does not return anything but retains the data
         */
        GoogleChartService.init = function(){
            this.rawData = {};
            this.chartObject = {};
            this.setHeader();
            this.chartObject.type = "LineChart";
            this.chartObject.data = {};
            this.chartObject.options = {};
            this.chartObject.options.height = 400;
            this.chartObject.options.width = '85%';
            this.chartObject.options.vAxis = {};
            this.chartObject.options.hAxis = {};
            this.chartObject.options.chartArea = {'width': '80%', 'height': '70%'};
        }

        /**
         * Converts header value from one to another
         * @param yVarVal
         * @returns {*}
         */
        GoogleChartService.convertHeaderObjectValue = function(yVarVal){
            if(typeof yVarVal == 'undefined' || yVarVal == '') return "Total Number of Users";
           return ArrayService.convertObjectValue(this.headerData, 'yVar', yVarVal, 'label');
        }

        /**
         * Get Header for Graph/Table
         */
        GoogleChartService.getHeader = function(){
            if(typeof this.headerData == 'undefined'){ this.setHeader(); }
            return this.headerData;
        }

        /**
         * Convert Header value to another
         * @param { string } from : key to convert to
         * @param { string } to : key to convert to
         */

        /**
         * Set Header for Graph/Table
         */
        GoogleChartService.setHeader = function(renew){
            if(typeof this.headerData != 'undefined' && typeof renew == 'undefined') return;
            this.headerData = [];
            this.headerData.push({label : 'Date', yVar : 'timestamp'});
            this.headerData.push({label : 'Total Number of Users', yVar : 'totalUsers'});
            this.headerData.push({label : 'Time Spent (min/day)', yVar : 'timeSpent'});
            this.headerData.push({label : 'DAU/MAU', yVar : 'daumau'});
            this.headerData.push({label : 'DAU/WAU', yVar : 'dauwau'});
            this.headerData.push({label : 'WAU/MAU', yVar : 'waumau'});
        }
        /**
         * Set currently existing data
         * @param  { data }
         * @return { self }
         */
        GoogleChartService.set = function(data){
            if(typeof this.chartObject == 'undefined'){ this.init(); }
            this.rawData = data;
            return this;
        }

        /**
         * Set a reference to the current scope
         * @param none
         * @returns {{}|*}
         */
        GoogleChartService.get = function(){
            return this.chartObject;
        }


        /**
         * Given the data, output the horizontal (date) and vertical plots
         * @param { array } _yid : Y axis identifier
         * @return { obj } this : self;
         */
        GoogleChartService.assemble = function(_yid) {
            var max = 0;
            var min = 0;
            var obj = this.chartObject.data;

            var label = this.convertHeaderObjectValue(_yid);

            obj.cols = [
                {id: "t", label: "Date", type: "string"},
                {id: "s", label: label, type: "number"}
            ];
            obj.rows = [];

            this.rawData.forEach(function (e, i) {
                if(e[_yid] > max) max = e[_yid];
                if(e[_yid] < min) min = e[_yid];
                obj.rows.push({c : [{v : e.timestamp}, {v : (e[_yid]) }]});
            })

            this.background.max = max;
            this.background.min = min;
            if(max < 1.1 && min > -0.1){
            // if the y values is between 0 and 1, this prevents the graph from looking weird and discrete
                this.chartObject.options.vAxis.maxValue = 1.0;
                this.chartObject.options.vAxis.minValue = 0.0;
            }

            return this;
        }


        return GoogleChartService;

    }])

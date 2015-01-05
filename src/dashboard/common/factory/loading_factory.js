/**
 * Purpose of this is to keep loading simple for the root controller to manage
 */
angular.module('dashboard')
    .factory('LoadingManager', function(){

        var LoadingService = {};

        LoadingService.queue = [];

        /**
         * Reeturns whether the service is loading
         * @param none
         * @returns { boolean }
         */
        LoadingService.isLoading = function(){
            return this.queue.length > 0;
        }

        /**
         * Stop Loading
         * @param { integer } id
         * @return { void }
         * Note : This should only remove one id, and not all.
         */
        LoadingService.stop = function(id){
            this.queue.forEach(function (e,i,o) {
                if(e.uid == id) {
                    o.splice(i, 1);
                    if (!loadingExistForUID(id)) {
                        e.watcher(); // no more loading exists in this scope. remove watcher
                    }
                    return;
                }
            })
        }


        var loadingExistForUID = function(_uid){
            var exists = false;
            LoadingService.queue.forEach(function (e) {
                if(e.uid == _uid){exists = true; return; }
            })
            return exists;
        }
        /**
         * Start Loading
         * @param { integer } id
         * @return { void }
         * Note : This adds a watcher for the scope
         */
        LoadingService.start = function(scope){
            var _uid = scope.$id;
            var bind = scope.$on('$destroy', function(){
                destroyAllServiceForID(_uid);
            })
            this.queue.push({ uid: _uid, watcher: bind });
        }

        /**
         * Destroy All Service for ID
         * @param { integer } uid
         * @return { void }
         */
        var destroyAllServiceForID = function(uid){
            LoadingService.queue.forEach(function (e, i, o) {
                if (e.uid == uid) {
                    e.watcher(); // unbind watcher for $destroy
                    o.splice(i, 1);
                }
            })
        }

        return LoadingService;
    })
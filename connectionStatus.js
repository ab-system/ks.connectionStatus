

angular
    .module('connectionStatus', [])
    .value('connectionStatusSettings', { checkUrl: 'http://localhost:8080/test', checkDelay: 5000, defaultState: 'offline' })
    .service('connectionStatus', ['$window', '$rootScope', '$log', 'connectionStatusSettings', function ($window, $rootScope, $log, connectionStatusSettings) {

        function trace(message){
            return $log.debug('connectionStatus >> ' + message);
        };

        var events = {
            online: 'up',
            offline: 'down',
        };

        var _listeners = [];

        function findListener(listener){
            var listenerIndex = 0;
            var listener = _.find(_listeners, function(val, index){
                listenerIndex = index;
                return val.listener === listener;
            });
            if(!listener){
                return null;
            }
            return {
                index: listenerIndex,
                listener: listener
            }
        }

        function isOnline(){
            return Offline.state == events['online'];
        }

        this.isOnline = isOnline;

        this.isOffline = function () {
            return !isOnline();
        };

        this.$on = function (event, listener) {
            var wrapper = function () {
                var status = isOnline() ? 'online' : 'offline';
                trace('Status changed. Current status: ' + status);
                $rootScope.$apply(listener);
            };
            _listeners.push({ listener: listener, wrapper: wrapper });
            Offline.on(events[event], wrapper);
        };

        this.$off = function (event, listener) {
            var findListenerResult = findListener(listener);
            Offline.off(events[event], findListenerResult.listener.wrapper)
            _listeners.splice(findListenerResult.index, 1);
        };

        var _intervalId;

        this.start = function(checkUrl) {
            var url = checkUrl ? checkUrl : connectionStatusSettings.checkUrl;
            Offline.options = {
                checks: { xhr: {url: url } },
                checkOnLoad: true,
                interceptRequests: true,
                reconnect: false,
                requests: false,
                game: false
            };
            _intervalId = setInterval(Offline.check, connectionStatusSettings.checkDelay);
        }

        this.stop = function(){
            clearInterval(_intervalId);
        }

        Offline.state = events[connectionStatusSettings.defaultState];
    }])
/**
 * Created by eolt on 08.10.2015.
 */

    angular.module('components', ['connectionStatus'])
        .controller('mainCtrl', [ '$scope', '$http', '$log', 'connectionStatus',
            function($scope, $http, $log, connectionStatus) {

            function onlineHandler() {
                $scope.status = true;
            }

            function offlineHandler() {
                $scope.status = false;
            }

            connectionStatus.$on('online', onlineHandler);
            connectionStatus.$on('offline', offlineHandler);

            $scope.$on('$destroy', function() {
                connectionStatus.$off('online', onlineHandler);
                connectionStatus.$off('offline', offlineHandler);
            });

            $scope.check  = function() {
                $scope.status = connectionStatus.isOnline();
            };
                $scope.check();


        }]);
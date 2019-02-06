angular.module("yara")
.controller('mainController', function ($scope,$location) {
    $scope.isActive = function (viewLocation) {
        var current = (viewLocation === $location.path());
        return current;
    };
    $scope.$on('$includeContentLoaded', function (event, target) {
        
        $.getScript("assets/js/now-ui-dashboard.min.js?v=1.1.2", function () {
        
        });
        demo.initFullCalendar();
    });
    

})

define(['app'], function (app) {
    app.register.controller('HomeCtrl',['$scope', function ($scope) {

    	$scope.getLogin = function(user){
    		console.log(user);
    	};


    }]);

});

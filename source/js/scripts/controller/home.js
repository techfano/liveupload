define(['app'], function (app) {
    app.register.controller('HomeCtrl',['$scope','$resource','$location', function ($scope,$resource,$location) {


    	$scope.getLogin = function(user){
	
	    	var login = $resource('http://localhost:4000/api/auth/login/'+user.name+'/'+user.password);

	    	login.get(function(login){

	    		 localStorage.setItem("token", login.token);
    			$location.path('/dashboard');


	    	},function(error){

	    		if(error.status===401 || error.status===403){
		    		console.log(error);
	    		}


	    	});

    	};


    }]);

});

define(['app'], function (app) {
	app.factory('socketConfig', function(){

		return {
			config: function(){
				return io('http://localhost:4000');
			}

		};

	});

	app.factory('socket', ['socketConfig', function(){

		var socket = socketConfig.config;

		return {
			
			connect:function(fn){
				return socket.on('connect',fn);
			},

			event:function(fn){
				return socket.on('event',fn);
			},

			disconnect:function(fn){
				return socket.on('disconnect',fn);
			},

		};

	}]);

})



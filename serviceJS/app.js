/*
https://github.com/petersirka/node-mongolab
https://github.com/auth0/node-jsonwebtoken
http://code.tutsplus.com/es/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
*/

var express = require('express')
var app = express()
var mongodb = require('mongolab-provider').init('pinbuydb', 'o5wMMdzdsFiwqsD6Pd-gh2-rCRmUnk4N');
var jwt = require('jsonwebtoken');
var errorResponseText ='Error in authentication, user or Password.';
var expiredMinutesSession = 600;
var hashPhrase = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.';

app.use(function(req, res, next) {

	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();

});

app.set('json spaces', 2);

function authorized(req, res, next) {
	
	var header = req.headers["authorization"];
    
    jwt.verify(req.params.token, hashPhrase, function(err, decoded) {

    	if(err){
  			res.status(403);
  			res.send(errorResponseText);
  		}else{
			next();
  		}

    });

}

app.get('/api/auth/login/:user/:key', function(req, res) {

	var params = {

		where:{
			username:req.params.user,
			password:req.params.key
		}

	};
  
	mongodb.documents('user', params, function(err,data){

			var auth={};

			if(data[0]){

				var token = jwt.sign(data[0], hashPhrase,{ expiresInMinutes: expiredMinutesSession });

				if(req.params.user === data[0].username && req.params.key === data[0].password){
					auth.token = token;
					res.send(auth);				
				}else{				
					res.status(401);
					res.send(errorResponseText);				
				}
			}else{
				res.status(403);
				res.send(errorResponseText);						
			}
		
	});


});

app.get('/api/auth/verify/:token',authorized,function(req, res){

	jwt.verify(req.params.token, hashPhrase, function(err, decoded) {
  		if(err){
  			res.status(403);
  			res.send(err);
  		}else{
  			
			delete decoded.password;
			delete decoded.username;  			
  			res.send(decoded);

  		}
	});

});

app.get('/api/user/me/:id',authorized, function(req, res) {

	mongodb.findId('user', req.params.id, function(err,user){

		delete user.password;
		delete user.username;

		res.send(user);

	});

});

app.listen(4000);
console.log("App listening on port 4000");



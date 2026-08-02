const http = require('http')
http.createServer(function(req,res){
	res.write('We sgo2 we go we go: Env is staging');
	res.end();
}).listen(3001`);


console.log('Server stareted on port:3000');

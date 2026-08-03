const PORT = process.env.PORT || 3000;

const http = require('http')
http.createServer(function(req,res){
	res.write('we go: Env is staging');
	res.end();
}).listen(3001);


console.log('Server stareted on port:3000');

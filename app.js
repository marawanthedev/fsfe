const http = require('http')
http.createServer(function(req,res){
	res.write('We go we go we go');
	res.end();
}).listen(3000);


console.log('Server stareted on port:3000');

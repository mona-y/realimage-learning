var express=require('express');

var app=express();
var port=process.env.port || 3000;


var mongoose=require('mongoose');
var db=mongoose.connect('mongodb://localhost/bookAPI');
//automatically create bookAPI if database is not there
var Book=require('./models/bookModel'); 

var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); //what kind of body parser you need to use




var bookRoute=require('./Routes/bookRoutes')(Book);





app.use('/api/Books',bookRoute);   // so that above described routing convention is used by our app
app.use('/api/Authors',bookRoute);
















//simplest way of routing
app.get('/',function(req,res)
	{
		res.send('welcome to my api');
	});
app.listen(port,function(){
	console.log('gulp is running my app on PORT: '+ port);
});
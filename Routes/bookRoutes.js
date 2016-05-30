var express=require('express');
var _ = require('lodash');


var routes=function(Book){
	//more advanced way of routing
var bookRoute=express.Router();
bookRoute.route('/')
.post(function(req,res)
{
	var book=  new Book(req.body);
    //console.log(book);
    //res.send(book);
    
    book.save();
    res.status(201).send("created"+book); //send status book is created


})
.get(function(req,res){
	//var responseJson={hello: "this is my api"};
    //res.json(responseJson);
      

      /*Book.find(function(err,books){
      	if(err)
      		res.status(500).send(err);
      	else
      		res.json(books);
      });*/ //finds all the entries in db tb

      var query={}; //allwoing filtering og content based on genre paramter
      if(req.query.genre)
      {
      	query.genre=req.query.genre;
      }
      Book.find(query,function(err,books)
      {
      	var responseBooks = _.map(books, function(book) {
      		var b = _.pick(book, 'title', 'genre', 'author');
      		b.id = book._id;
      		return b;
      	});
         if(err)
         	res.status(500).send(err);
         else
         	res.json(responseBooks);
      });
});


//adding the middleware so that we don't need to read the same hing again and again
bookRoute.use('/:bookId',function(req,res,next){
    Book.findById(req.params.bookId,function(err,book)
    {
    	if(err)
    		res.status(500).send(err);
    	else if(book)
    	{
    		req.book=book;
    		next();
    	}
    	else
    	{
    		res.status(404).send('page not found');
    	}

    });

});





//this is for proper working of url like localhost/api/books/b1_id
//route for finding the boooks filtered on the parameter bookid at url
bookRoute.route('/:bookId').get(function(req,res)
{
     
     	res.json(req.book);

     
})
.put(function(req,res){
      	req.book.title=req.body.title;
      	req.book.author=req.body.author;
      	req.book.genre=req.body.genre;
      	req.book.read=req.body.read;
      	req.book.save(function(err)
      		{
      			if(err)
      				res.status(500).send(err);
      			else
      			{
      				res.json(req.book);
      			}
      		});
      	
      
   
})
.patch(function(req,res){

	if(req.body._id)
		delete(req.body._id);
     for(var p in req.body)   //for ecvrey key it is gonna give paramter

     {
       req.book[p]=req.body[p];
     }
     req.book.save(function(err){
     	if(err)
     		res.status(500).send(err);
     	else
     		res.json(req.book);
     });
 })

.delete(function(req,res){
	req.book.remove(function(err){
		if(err)
			res.status(500).send(err);
		else
			res.status(204).send('removed');
	});
});


return bookRoute;

};
module.exports=routes;
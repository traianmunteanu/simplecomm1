var logged =0; /*I use logged variable to verify if the user is logged successfully or not*/
var user; /* I use user variable to display on each page "Welcome, <user> !" */

/*homepage*/

exports.homepage = function(req, res) {
	res.render("homepage", { 
		// Template data
		title: "Home" ,
		logged: logged,
		user:user
	});
};


 /*categoriesMenu*/ 

exports.categories = function(req, res) {
	var _         = require('underscore');
	var mdbClient = require('mongodb').MongoClient;

	mdbClient.connect("mongodb://localhost:27017/shop", function(err, db){
		var collection = db.collection('categories');

		collection.find({name: req.params.title}).toArray(function(err,items){
			res.render("categoriesMenu", {
				_     : _,
				items: items,
				title: req.params.title,
				currentCat: req.params.title,
				logged: logged,
				user:user
			});
			db.close();
		});
	});
};




/*subcategoriesMenu*/

exports.subcategories = function(req, res) {
	var _         = require('underscore');
	var mdbClient = require('mongodb').MongoClient;

	mdbClient.connect("mongodb://localhost:27017/shop", function(err, db){
		var collection = db.collection('categories');

		collection.find({name:req.params.title},{categories: { $elemMatch:  {name: req.params.category} } }).toArray(function(err,items){

			res.render("subcategoriesMenu", {
				_     : _,
				items: items,
				title: req.params.title,
				currentCat:req.params.title,
				currentSubC:req.params.category,
				logged: logged,
				user:user
			});
			db.close();
		});
	});
};



/*productsInSubC*/

exports.products = function(req, res) {
	var _         = require('underscore');
	var mdbClient = require('mongodb').MongoClient;
	

	function fromPrevious(skip, limit){
		return skip-limit;
	};
	function fromNext(skip, limit){
		return skip+limit;
	};

	

	mdbClient.connect("mongodb://localhost:27017/shop", function(err, db){
		var collectionP = db.collection('products');
		var limit =10;
		
		
		collectionP.find({primary_category_id: req.params.id}).skip(req.query.from*1).limit(req.query.to*1).toArray(function(err,items){
			res.render("productsInSubC", {
				_     : _,
				items: items,
				title: req.params.title,
				currentCat: req.params.title,
				currentSubC: req.params.category,
				currentSubSubC:req.params.subcategory,
				currentid: req.params.id,
				fromP: fromPrevious(req.query.from*1,req.query.to*1),
				fromN: fromNext(req.query.from*1,req.query.to*1),
				limitP: limit,
				logged: logged,
				user:user
			
			});
			db.close();
		});
	});
};



/*product*/


exports.product = function(req, res) {
	var _         = require('underscore');
	var mdbClient = require('mongodb').MongoClient;

	mdbClient.connect("mongodb://localhost:27017/shop", function(err, db){
		var collectionP = db.collection('products');
		
		collectionP.find({id:req.params.idprod}).toArray(function(err,items){
			res.render("product", {
				_     : _,
				items: items,
				title: req.params.title,
				currentCat: req.params.title,
				currentSubC: req.params.category,
				currentSubSubC:req.params.subcategory,
				currentProduct: req.params.page_title,
				currentid: req.params.id,
				logged: logged,
				user:user
				
			});
			db.close();
		});
	});
};

exports.productDetail = function (req,res){
	var _      = require('underscore');
	var mdbClient = require('mongodb').MongoClient;

	mdbClient.connect("mongodb://localhost:27017/shop", function(err,db){
		var collection = db.collection('products');

		collection.find({id:req.params.idprod}).toArray(function(err,items){
			res.render('productDetail', {
				_   : _,
				items: items,
				title: req.params.title,
				currentCat: req.params.title,
				currentSubC: req.params.category,
				currentSubSubC:req.params.subcategory,
				currentProduct: req.params.page_title,
				currentid: req.params.id,
				currentIdProduct: req.params.idprod,
				logged: logged,
				user:user
			});
			db.close();
		});
	});
};



exports.signup = function(req,res){
	var mdbClient = require('mongodb').MongoClient;

	mdbClient.connect("mongodb://localhost:27017/shop", function(err,db){
		var collection = db.collection('users');

		collection.insert({user: req.body.username, pass: req.body.password, email:req.body.email, firstname:req.body.firstname,lastname:req.body.lastname}, function(err,saved){
			if( err || !saved ) console.log("User not saved");
			else console.log("User saved");
			db.close();
		});

	});
};

exports.login = function(req,res){
	var mdbClient = require('mongodb').MongoClient;

	mdbClient.connect("mongodb://localhost:27017/shop", function(err,db){
		var collection = db.collection('users');

		collection.findOne({user:req.body.username, pass:req.body.password}, function(err,login){
			if( err || !login ) console.log('Login failed');
			else 
				{
					console.log('Success');
					logged=1;
					user=req.body.username;
				}
			db.close();
		});
	});
};

exports.logout = function(req, res){
	logged=0;
	res.redirect("/");
};
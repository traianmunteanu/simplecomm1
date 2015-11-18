// Module dependencies.
var express = require("express")
  , http    = require("http")
  , path    = require("path")
  , routes  = require("./routes")
  , errorhandler = require("errorhandler")
  , connect = require("connect")
  , soap = require("soap")
  , url = 'http://infovalutar.ro/curs.asmx?wsdl';
var app = express();


/*var args = { Moneda:"USD",
             dt:"2014-03-12",
             thedate:"2014-03-14",
             themoneda:"EUR",
             TheDate:"2014-01-12" };

soap.createClient(url, function(err, client) {
  client.GetLatestValue(args, function(err, result) {
      console.log(result);
  });
  client.getall(args, function(err,result){
      console.log(result);
  });
  client.getvalue(args, function(err,result){
      console.log(result);
  });
  client.getvalueadv(args, function(err,result){
      console.log(result);
  });
  client.lastdateinserted(args, function(err,result){
      console.log(result);
  });

});
*/




// All environments
app.set("port", 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser("61d333a8-6325-4506-96e7-a180035cc26f"));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));

if (app.get('env') === 'development') {
    app.use( errorhandler() );
}

/*homepage*/

app.get("/"     , routes.homepage);

/*categoriesMenu*/

app.get("/site/shop/:title", routes.categories);

/*subcategoriesMenu*/

app.get("/site/shop/:title/:category", routes.subcategories);


/*productsInSubC*/

app.get("/site/shop/:title/:category/:subcategory/:id", routes.products);


/*product*/

app.get("/site/shop/:title/:category/:subcategory/:id/:page_title/:idprod", routes.product);

/*productDetail*/

app.get("/site/shop/:title/:category/:subcategory/:id/:page_title/:idprod/Details", routes.productDetail);

/*Modal windows*/

app.post('/signup', routes.signup);

app.post('/login', routes.login);

app.post('/logout', routes.logout);



// Run server
http.createServer(app).listen(app.get("port"), function() {
	console.log("Express server listening on port " + app.get("port"));
});

var express = require('express')
  , t = require('./core/thread');

var app = module.exports = express.createServer();
    app.register(".jqtpl", require("jqtpl").express);

var thread = new t.Thread('Message text','Author name'),
    subThread =  new t.Thread('re Message text','second Author name'),
    subSubThread =  new t.Thread('re re Message text','third Author name');

thread.addChild(subThread);
subThread.addChild(new t.Thread('re re Message text','third Author name'));
thread.addChild(new t.Thread('re Message2 text','Author name'));

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jqtpl');
    app.use(express.bodyParser());
    //app.use(express.methodOverride());
    //app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

// Routes
app.get('/', function(req, res){
    res.render('index', { thread: thread });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
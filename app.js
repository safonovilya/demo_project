var express = require('express'),
    t = require('./core/thread'),
    r = require('./core/repository'),
    async = require('async');

var app = module.exports = express.createServer();
    app.register(".jqtpl", require("jqtpl").express),
    repository = new r.Repository();

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
    var repository = new r.Repository();
    async.waterfall([
        function(callback){
            repository.open(callback);
        },
        function(callback){
            repository.getMainThread(callback);
        }
    ],
    function(error, thread){
        if (error){
            res.render('index', {thread: null});
        } else {
            res.render('index', {thread: thread.getModel()});
        }
    });

});

app.post('/add/', function(req, res){

    async.waterfall([
        function(callback){
            if (req.body.rootID){
                repository.findThreadByID(req.body.rootID, callback);
            } else {
                callback(null,null);
            }
        },
        function(parentThread, callback){
            var thread = new t.Thread(req.body.msgText, req.body.author, parentThread);
            repository.insertThread(thread, callback);
        },
        function(thread){
            res.partial('thread', { thread: thread.getModel() });
        }
    ],
    function(error, result){
        repository.close();
    }
    );


});
app.get('/404', function(req, res){
    throw new NotFound;
});

process.on('exit', function () {
    repository.close();
});
async.waterfall(
    [
        function(callback){
            repository.open(callback);
        },
        function(callback){
            app.listen(90, function(){
                console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
                callback();
            });
        }
    ],
    function(){
        console.log('good');
    }
);

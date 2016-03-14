var express = require('express');

//mysql is what's returned in dbcon.js, aka pool
//call this once; aka, don't call it during every request
//as this is inefficient
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/',function(req,res,next){
  var context = {};
    mysql.pool.query('SELECT * FROM student', function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.render('home', context);
    });
});

app.get('/insert', function(req, res, next){
    var context = {};
    //use backtics for table names or call names
    //single quotes are for strings
    // question marks are for db security
    // they represent some thing that will be inserted instead of executed
    /*
    "INSTER INTO student (`name`) VALUES " + user.input
    where user.input = "('foo;); SELECT * FROM passwords)" 
    That could be executed unless it's input with a question mark!
    */
    //var entry = "Inserted task via string!";
//[req.query.c]
    mysql.pool.query("INSERT INTO student (`name`) VALUES (?)", [req.query.c], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Inserted id " + result.insertId;
        res.render("home", context);
    });
});

app.get('/delete', function(req, res, next){
    var context = {};
    mysql.pool.query("DELETE FROM student WHERE id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        //didn't work in lecture video
        // when I practiced this, it said 0 changedRows, but the row was deleted
        //maybe I should try deletedRows
        //deletedRows said undefined...need to look at docs
        context.results = "Deleted " + result.deletedRows + " rows.";
        res.render("home", context);
    });
});


//if this function gets called without all the req.query.name stuff
//then the missing ones will have their values deleted!
//use safe update to avoid this!
app.get("/simple-update", function(req, res, next){
    var context ={};
    mysql.pool.query("UPDATE student SET name=?, done=?, due=? WHERE id=? ", [req.query.name, req.query.done, req.query.due, req.query.id], function(err,result){
        if(err){
            next(err);
            return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        res.render("home", context);
    });
});

app.get("/safe-update", function(req, res, next){
    var context = {};
    mysql.pool.query("SELECT * FROM student WHERE id=?", [req.query.id], function(err,result){
        if(err){
            next(err);
            return;
        }
        if(result.length == 1){
            //db rows are sent as arrays where one item in the array is one row in the db
            var curValues = result[0];
            // || will evaluate to the first if the first is true otheriwse
            //it will always evaluate to the second, wehter or not the second
            //is true or false
            //WHELL, WHAT ABOUT || FOR THE BOOLEAN DONE?
            //values are sent as strings so "false" would be a true value
            //NOTE: this don'est update values to null
            //'SELECT * FROM student'
            mysql.pool.query("UPDATE student SET name=?, done=?, due=? WHERE id=? ", [req.query.name || curValues.name, req.query.done || curValues.done, req.query.due || curValues.due, req.query.id || curValues.id], function(err, result){
                if(err){
                    next(err);
                    return;
                }
                 context.results = "Updated " +result.changedRows + " rows.";
                 res.render("home", context);
            });
        }
    });
});


//NEVER DO THIS IN A REAL DB WEBSITE!!!!
//This is practice only.  We shouldn't really be doing this in js.
//This is just for learning purposes.
app.get("/reset-table", function(req,res, next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS student",  function(err){
/*        var createString = "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE,"+
            "lbs BOOLEAN)";*/
        var createString = "CREATE TABLE student(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "done BOOLEAN," +
            "due DATE)";
        mysql.pool.query(createString, function(err){
            context.results = "Table reset";
            res.render("home", context);
        });
    });
});

app.post('/Edit_Excersice',function(req,res){
  var context = {};
  res.render('edit', context);
});

app.post('/',function(req,res){
  var context = {};
  res.render('home', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

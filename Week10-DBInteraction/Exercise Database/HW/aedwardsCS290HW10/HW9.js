/*
Adina Edwards
CS290
13th March 2016
Help from Chavis Sabin on AJAX
*/

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
        return;
    });
    console.log("ERROR getting to /");
});

app.post('/insert', function(req, res, next){
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
    mysql.pool.query("INSERT INTO student (`exercise`) VALUES (?)", [req.query.exercise], function(err, result){
        if(err){
            next(err);
            return;
        }
        context.results = "Inserted id " + result.insertId;
        res.render("home", context);
    });
});


app.post('/delete', function(req, res, next){
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



app.get("/safe-update", function(req, res, next){
    console.log("Inside safe update");
    var context = {};
    var id = null;
    var exercise = null;
    var reps = null;
    var weight = null;
    var date = null;
    var units = null;
    if(req.body["submit"]){
        console.log("Submit button clicked!");
        //will need to get id somehow
        id = 1;
        exercise = req.body.exercise;
        reps = req.body.reps;
        weight = req.body.weight;
        date = req.body.date;
        units = req.body.units;
    }
    mysql.pool.query("SELECT * FROM student WHERE id=?", [id], function(err,result){
        //console("safe-update req.query.id is: " + id);
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
            mysql.pool.query("UPDATE student SET exercise=?, reps=?, weight=?, date=?, units=? WHERE id=? ", [exercise || curValues.exercise, reps || curValues.reps, weight || curValues.weight, date || curValues.date, units || curValues.units, req.query.id || curValues.id], function(err, result){
                console("safe-update req.query.exercise is: " + req.query.exercise);
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
app.post("/reset-table", function(req,res, next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS student",  function(err){
        var createString = "CREATE TABLE student(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "exercise VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function(err){
            context.results = "Table reset";
            res.render("home", context);
        });
    });
});

/*app.post('/Edit_Excersice',function(req,res){
  var context = {};
  res.render('edit', context);
});*/

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

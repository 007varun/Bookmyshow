
var express = require('express');  
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// Connect to the db

MongoClient.connect("mongodb://127.0.0.1/mydb", function(err, db) {
 if(!err) {
    console.log("We are connected");

app.use(express.static('public')); //making public directory as static directory  
app.use(bodyParser.json());
app.get('/', function (req, res) {  
   console.log("Got a GET request for the homepage");  
   res.send('<h1>Welcome to MSRIT</h1>');  
})
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/index.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );    
})  

app.get('/insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "insert.html" );
})
/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
  res.setHeader('Content-Type', 'text/html');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
    console.log("Sent data are (POST):usn :"+req.body.usn+"  name="+req.body.name+"cgpa:"+req.body.cgpa+"12th per"+req.body.per+"backlog"+req.body.bck+"semester"+req.body.sem+"extra curicular"+req.body.exc);
    // Submit to the DB
    var usn = parseInt(req.body.usn);
    var name = req.body.name;
    var bck=parseInt(req.body.bck);
    var sem=parseInt(req.body.sem);
    var proc=req.body.proc;
    var exc=req.body.exc;
    var cgpa=parseInt(req.body.cgpa);
  db.collection('student').insert({usn:usn,name:name,bck:bck,sem:sem,cgpa:cgpa,proc:proc,exc:exc});
    res.end("student Inserted-->"+JSON.stringify(req.body));
    /*Sending the respone back to the angular Client */
});

//--------------------------GET METHOD-------------------------------
app.get('/process_get', function (req, res) { 
// Submit to the DB
  var newStd = req.query;
  var usn =req.query['usn'];
    var name = req.query['name'];
    var proc=req.query['proc'];
    var cgpa=parseInt(req.query['cgpa']);
    var sem=parseInt(req.query['sem']);
    var bck=parseInt(req.query['bck']);
    var exc=req.query['exc'];
  db.collection('student').insert({usn:usn,name:name,bck:bck,sem:sem,cgpa:cgpa,proc:proc,exc:exc}); 
    console.log("Sent data are (GET): usn :"+usn+" name :"+name+"cgpa:"+cgpa+"12th per"+per+"backlog"+bck+"semester"+sem+"proctor"+proc+"extra curicular"+exc);
    res.end("student Inserted-->"+JSON.stringify(newStd));
}) 

//--------------UPDATE------------------------------------------
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update", function(req, res) {
  var name1=req.query.name;
 
  //-----------------------------------------
  db.collection('student', function (err, data) {
        data.update({"name":name1},{$set:{"name":"newstd"}},{multi:true},
            function(err, result){
        if (err) {
          console.log("Failed to update data.");
      } else {
        res.send(result);
        console.log("student Updated")
      }
        });
    });
})  
//...............search........................................................
app.get('/search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "search.html" );    
})

app.get("/search", function(req, res) {
  
  var usnnum=parseInt(req.query.usn);
    db.collection('student').find({usn:usnnum}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else {
      res.status(200).json(docs);
    }
  });
  });
  app.get("/search", function(req, res) {

    var bcknum=parseInt(req.query.bck);
      db.collection('student').find({bck:bcknum}).toArray(function(err, docs) {
      if (err) {
        console.log(err.message+ "Failed to get data.");
      } else {
        res.status(200).json(docs);
      }
    });
    });
   
    

//--------------DELETE------------------------------------------
app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

app.get("/delete", function(req, res) {
 
  var usnnum=parseInt(req.query.usn);
  db.collection('student', function (err, data) {
        data.remove({"usn":usnnum}, function(err, result){
        if (err) {
          console.log("Failed to remove data.");
      } else {
        res.send(result);
        console.log("student  Deleted")
      }
        });
    });
    
  });
app.get('/display', function (req, res) { 
//-----DISPLAY IN JSON FORMAT  -------------------------
/*db.collection('student').find({}).toArray(function(err, docs) {
    if (err) {
      console.log("Failed to get data.");
    } else 
  {
    res.status(200).json(docs);
    }
  });*/
//-------------DISPLAY USING EMBEDDED JS -----------
 db.collection('student').find().sort({usn:1}).toArray(
    function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{student: i})  
     })
//---------------------// sort({empid:-1}) for descending order -----------//
}) 
app.get('/about', function (req, res) {  
   console.log("Got a GET request for /about");  
   res.send('MSRIT, Dept. of CSE');  
})  
 
var server = app.listen(3000, function () {  
var host = server.address().address  
  var port = server.address().port  
console.log("Example app listening at http://%s:%s", host, port)  
})  
}
else
{   db.close();  }
  
});
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();
var PORT = process.env.PORT;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "movie_planner_db"
  });
};

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);

});

app.get("/", function(req, res) {
  connection.query("SELECT * FROM movies;", function(err, data) {
    if (err) {
      throw err;
    }

    res.render("index", { movies: data });

  });
});

app.post("/create", function(req, res) {
  connection.query("INSERT INTO movies (movie) VALUES (?)", [req.body.movie], function(err, result) {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});

app.delete("/delete", function(req, res) {
  connection.query("DELETE FROM movies WHERE id = ?", [req.body.id], function(err, result) {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});

app.put("/update", function(req, res) {

  connection.query("UPDATE movies SET movie = ? WHERE id = ?", [
    req.body.movie, req.body.id
  ], function(err, result) {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});

app.listen(PORT);

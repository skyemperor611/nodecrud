const mysql = require("mysql");
const express = require("express");
const fs = require("fs");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs",
  port: "3306"
});

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.listen(3000, () => {
  console.log("서버시작");

  connection.connect();
});

app.get("/", (req, res) => {
  fs.readFile("bookList.html", "utf-8", (err, data) => {
    connection.query("SELECT * FROM books", (err, results, fields) => {
      if (err) throw error;
      res.send(
        ejs.render(data, {
          data: results
        })
      );
    });
  });
});

app.get("/delete/:id", (req, res) => {
  connection.query("DELETE FROM books where number=?", [req.params.id], () => {
    res.redirect("/");
  });
});

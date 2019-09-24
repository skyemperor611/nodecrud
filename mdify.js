const mysql = require("mysql");
const express = require("express");
const fs = require("fs");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
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
    connection.query("SELECT * FROM books ", (err, results, fields) => {
      if (err) throw error;
      res.send(
        ejs.render(data, {
          data: results
        })
      );
    });
  });
});

app.get("/create", (req, res) => {
  fs.readFile("insertNewBook.html", "utf-8", (err, data) => {
    if (err) throw error;
    res.send(data);
  });
});

app.post("/create", (req, res) => {
  const body = req.body;
  connection.query(
    "INSERT INTO books (genre, name, writer, releasedate) VALUE (?, ?, ?, ?)",
    [body.genre, body.name, body.writer, body.releasedate],
    () => {
      res.redirect("/");
    }
  );
});

app.get("/modify/:id", (req, res) => {
  fs.readFile("modify.html", "utf-8", (err, data) => {
    connection.query(
      "SELECT * FROM books WHERE number =?",
      [req.params.id],
      (err, results) => {
        if (err) throw error;
        console.log(req.params.id);
        res.send(
          ejs.render(data, {
            data: results[0]
          })
        );
      }
    );
  });
});

app.post("/modify/:id", (req, res) => {
  const body = req.body;
  connection.query(
    "UPDATE books SET genre = ?, name = ?, writer = ? WHERE number = ?",
    [body.genre, body.name, body.writer, req.params.id],
    (err, results) => {
      if (err) throw error;
      res.redirect("/");
    }
  );
});

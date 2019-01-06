/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;

let bookDb;
MongoClient.connect(
  MONGODB_CONNECTION_STRING,
  function(err, db) {
    if (err) {
      console.log("Mongo error: " + err.message);
    }
    bookDb = db;
  }
);

module.exports = function(app) {
  app
    .route("/api/books")
    .get(function(req, res) {
      bookDb
        .collection("books")
        .find()
        .toArray((err, docs) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Internal server error");
          }
          const resObj = docs.map(doc => ({
            _id: doc._id,
            title: doc.title,
            commentcount: doc.comments.length
          }));
          res.send(resObj);
        });
    })

    .post(function(req, res) {
      const title = req.body.title;
      if (!title) return res.status(400).send("missing title");
      bookDb
        .collection("books")
        .insertOne({ title, comments: [] }, (err, r) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Internal server error");
          }
          res.send(r.ops[0]);
        });
    })

    .delete(function(req, res) {
      bookDb.collection("books").deleteMany({}, err => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal server error");
        }
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      const bookid = req.params.id;
      let searchId;
      try {
        searchId = new ObjectId(bookid);
      } catch (err) {
        console.log(err);
        return res.status(400).send("Invalid id");
      }
      bookDb.collection("books").findOne({ _id: searchId }, (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal server error");
        }
        if (!doc) return res.send("no book exists");
        res.send(doc);
      });
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      let searchId;
      try {
        searchId = new ObjectId(bookid);
      } catch (err) {
        console.log(err);
        return res.status(400).send("Invalid id");
      }
      bookDb
        .collection("books")
        .findOneAndUpdate(
          { _id: searchId },
          { $push: { comments: comment } },
          { returnOriginal: false },
          (err, r) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Internal server error");
            }
            if (!r) res.send("no book exists");
            res.send(r.value);
          }
        );
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      let searchId;
      try {
        searchId = new ObjectId(bookid);
      } catch (err) {
        console.log(err);
        return res.status(400).send("Invalid id");
      }
      bookDb
        .collection("books")
        .findOneAndDelete({ _id: searchId }, (err, r) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Internal server error");
          }
          res.send("delete successful");
        });
      //if successful response will be 'delete successful'
    });
};

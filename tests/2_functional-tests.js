/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "Post with title", test: true })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "_id",
                "response object should contain _id"
              );
              assert.property(
                res.body,
                "title",
                "response object should contain title"
              );
              assert.property(
                res.body,
                "comments",
                "response object should contain comments"
              );
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .end((err, res) => {
              assert.equal(res.status, 400);
              assert.equal(res.text, "missing title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "Post with title" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(
              res.body,
              "_id",
              "response object should contain _id"
            );
            assert.property(
              res.body,
              "title",
              "response object should contain title"
            );
            assert.property(
              res.body,
              "comments",
              "response object should contain comments"
            );
            assert.equal(res.body.title, "Post with title");
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/1c30c209f60ea10090fc3523")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get(`/api/books/507f1f77bcf86cd799439011`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(
              res.body,
              "_id",
              "response object should contain _id"
            );
            assert.property(
              res.body,
              "title",
              "response object should contain title"
            );
            assert.property(
              res.body,
              "comments",
              "response object should contain comments"
            );
            assert.equal(res.body.title, "Post with title");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post(`/api/books/507f1f77bcf86cd799439011`)
            .send({ comment: "test comment" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(
                res.body,
                "_id",
                "response object should contain _id"
              );
              assert.property(
                res.body,
                "title",
                "response object should contain title"
              );
              assert.property(
                res.body,
                "comments",
                "response object should contain comments"
              );
              assert.equal(res.body.title, "Post with title");
              done();
            });
        });
      }
    );
    suite("DELETE /api/books/[id] => expect delete msg", function() {
      test("Test DELETE /api/books/[id]", function(done) {
        chai
          .request(server)
          .delete(`/api/books/507f1f77bcf86cd799439011`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });
    });
  });
});

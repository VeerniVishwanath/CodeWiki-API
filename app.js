const express = require("express");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

// Use EJS
app.set("view engine", "ejs");
// Body-Parser
app.use(express.urlencoded({ extended: true }));
// Set Static folder
app.use(express.static("public"));

// Calling Main function
main().catch((err) => {
  console.log(err);
});

// Main async function
async function main() {
  const url = "mongodb://127.0.0.1:27017/";
  const Path = "wikiDB";
  await mongoose.connect(url + Path);

  // Schema of wikiDB
  const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
  });

  // Model/Collection of wikiDB
  const Article = new mongoose.model("Article", articleSchema);

  // Default Article Route
  app
    .route("/articles")

    .get((req, res) => {
      Article.find({}, (err, result) => {
        if (!err) {
          res.send(result);
        } else {
          res.send("Error inside articles Route !!" + err);
        }
      });
    })

    .post((req, res) => {
      const title = _.upperFirst(req.body.title);
      const content = req.body.content;
      // Saving to MongoDB
      const newArticle = new Article({
        title: title,
        content: content,
      }).save((err) => {
        if (!err) {
          res.send("Successfully added new article!!");
        } else {
          res.send("Error while adding new article :" + err);
        }
      });
    })

    .delete((req, res) => {
      Article.deleteMany()
        .then(() => {
          res.send("Successfully Deleted");
        })
        .catch((err) => {
          res.send("Error while deleting route articles :" + err);
        });
    });

  // Individual Articles Route
  app
    .route("/articles/:individualArticle")

    .get((req, res) => {
      Article.findOne(
        { title: req.params.individualArticle },
        (err, result) => {
          if (!err) {
            res.send(result);
          } else {
            res.send("Error with finding the individual articles " + err);
          }
        }
      );
    })

    .put((req, res) => {
      Article.replaceOne(
        { title: req.params.individualArticle },
        { title: req.body.title, content: req.body.content }
      )
        .then(() => {
          res.send("Successfully Updated put");
        })
        .catch((err) => {
          res.send(err);
        });
    })

    .patch((req, res) => {
      Article.updateOne(
        { title: req.params.individualArticle },
        { title: req.body.title, content: req.body.content }
      )
        .then(() => {
          res.send("Successfully Updated patch");
        })
        .catch((err) => {
          res.send(err);
        });
    })

    .delete((req, res) => {
      Article.deleteOne({ title: req.params.individualArticle })
        .then(() => {
          res.send("Deletion Success");
        })
        .catch((err) => {
          res.send("Error while deleting " + err);
          console.log("Error while deleting " + err);
        });
    });

  app.listen(3000, () => {
    console.log("Server started at port 3000");
  });
}

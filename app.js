const express = require("express");
const mongoose = require("mongoose");
const app = express();

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

  app.get("/articles", (req, res) => {
    Article.find({}, (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        res.send("Error inside articles Route !!" + err);
      }
    });
  });

  app.post("/articles", (req, res) => {
    const title = req.body.title;
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
  });

  app.delete("/articles", (req, res) => {
    Article.deleteMany()
      .then(() => {
        res.send("Successfully Deleted");
      })
      .catch((err) => {
        res.send("Error while deleting route articles :" + err);
      });
  });

  app.listen(3000, () => {
    console.log("Server started at port 3000");
  });
}

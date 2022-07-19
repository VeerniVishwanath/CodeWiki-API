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
        res.render("articles", {
          articles: result,
        });
      } else {
        res.send("Error inside articles Route !!" + err);
      }
    });
  });

  app.listen(3000, () => {
    console.log("Server started at port 3000");
  });
}

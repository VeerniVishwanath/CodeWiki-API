const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Use EJS
app.set("view-engine", "EJS");
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
  const url = "mongodb://127.0.0.1/";
  const Path = "wikiDB";
  await mongoose.connect(url + Path);

  // Schema of wikiDB
  const wikiSchema = new mongoose.Schema({
    title: "String",
    content: "String",
  });

  // Model/Connection of wikiDB
  const Article = new mongoose.model("Article", wikiSchema);

  app.get("/", (req, res) => {
    res.redirect("/");
  });

  app.listen(3000, () => {
    console.log("Server started at port 3000");
  });
}

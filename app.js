const express = require("express");
const path = require("path");
const app = express();

const messages = [
  {
    text: "Hi there!",
    user: "Mang chang",
    added: new Date(),
  },
  {
    text: "Hi-fi",
    user: "Ming ching",
    added: new Date(),
  },
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index", { title: "Home", messages });
});

app.get("/new", (req, res) => {
  res.render("new", { title: "New Message" });
});

app.post("/new", (req, res) => {
  const { author, message } = req.body;
  if (author && message) {
    messages.unshift({
      text: message,
      user: author,
      added: new Date(),
    });
  }
  res.redirect("/");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

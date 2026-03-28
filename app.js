require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const { initDb, getMessages, addMessage } = require("./db");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res, next) => {
  try {
    const messages = await getMessages();
    res.render("index", { title: "Home", messages });
  } catch (error) {
    next(error);
  }
});

app.get("/new", (req, res) => {
  res.render("new", { title: "New Message" });
});

app.post("/new", async (req, res, next) => {
  const { author, message } = req.body;
  try {
    if (author && message) {
      await addMessage(author, message);
    }
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});

const PORT = process.env.PORT || 3000;

(async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// set up database connection
const db = new pg.Client({
   user: "postgres",
   host: "localhost",
   database: "booknotes",
   password: "Zjm!!231617",
   port: 5432,
});

await db.connect();

async function fetchBooksFromDB(sortOption = "date_read") {
   // enable sorting by rating, date read, or title
   let sortColumn;
   switch (sortOption) {
      case "rating":
         sortColumn = "rating DESC";
         break;
      case "title":
         sortColumn = "title ASC";
         break;
      case "date_read":
      default:
         sortColumn = "date_read DESC";
         break;
   }

   try {
      const result = await db.query(
         `SELECT * FROM books ORDER BY ${sortColumn}`
      );
      return result.rows;
   } catch (err) {
      console.error("Error fetching books:", err);
      return [];
   }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// main page that shows all books
app.get("/", async (req, res) => {
   const sort = req.query.sort || "date_read";
   const books = await fetchBooksFromDB(sort);
   res.render("index.ejs", { books, sort });
});

// able to add a new book
app.get("/add", (req, res) => {
   res.render("add.ejs");
});

app.post("/add", async (req, res) => {
   const { title, author, rating, date_read, notes, cover_url } = req.body;
   try {
      await db.query(
         "INSERT INTO books (title, author, rating, date_read, notes, cover_url) VALUES ($1, $2, $3, $4, $5, $6)",
         [title, author, rating, date_read, notes, cover_url]
      );
      res.redirect("/");
   } catch (err) {
      console.error("Failed to insert book:", err);
      res.send("Error adding book.");
   }
});

// able to edit a book
app.get("/edit/:id", async (req, res) => {
   const bookId = req.params.id;
   try {
      const result = await db.query("SELECT * FROM books WHERE id = $1", [
         bookId,
      ]);
      if (result.rows.length > 0) {
         res.render("edit.ejs", { book: result.rows[0] });
      } else {
         res.status(404).send("Book not found.");
      }
   } catch (err) {
      console.error("Error fetching book for edit:", err);
      res.status(500).send("Error fetching book for edit.");
   }
});

app.post("/edit/:id", async (req, res) => {
   const bookId = req.params.id;
   const { title, author, rating, date_read, notes, cover_url } = req.body;
   try {
      await db.query(
         "UPDATE books SET title = $1, author = $2, rating = $3, date_read = $4, notes = $5, cover_url = $6 WHERE id = $7",
         [title, author, rating, date_read, notes, cover_url, bookId]
      );
      res.redirect("/");
   } catch (err) {
      console.error("Failed to update book:", err);
      res.send("Error updating book.");
   }
});

app.post("/delete/:id", async (req, res) => {
   const bookId = req.params.id;
   try {
      await db.query("DELETE FROM books WHERE id = $1", [bookId]);
      res.redirect("/");
   } catch (err) {
      console.error("Failed to delete book:", err);
      res.send("Error deleting book.");
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});

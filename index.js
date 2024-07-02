import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = 3000;

// DB
//for my local machine
//const db = new pg.Client({
//  user: "postgres",
//  host: "localhost",
//  database: "books",
//  password: "12345678",
//  port: 5432,
//});

// for deployment
const db = new pg.Client({
  user: "books_project_user",
  password: process.env.PG_PASS,
  database: "books_project_27cv",
  port: 5432,
  host: "dpg-cq1q2nbv2p9s73d605kg-a.singapore-postgres.render.com",
  ssl: true,
});

db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// DB query
async function bookDetails(sort_by, sort_order) {
  try {
    const result = await db.query(
      `SELECT * FROM book ORDER BY ${sort_by} ${sort_order}`,
    );
    return result;
  } catch (error) {
    console.error("Error retrieving book details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

let sort_by = "name";
let sort_order = "ASC";

app.get("/", async (_, res) => {
  const bookData = await bookDetails(sort_by, sort_order);
  try {
    res.render("index.ejs", {
      books: bookData.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/sort", async (req, res) => {
  sort_by = req.body.sort;
  sort_order = sort_by === "name" ? "ASC" : "DESC";
  res.redirect("/");
});

app.post("/save", async (req, res) => {
  const edited__text = req.body.edited__text;
  const id = req.body.id;
  try {
    await db.query(
      `UPDATE book SET review = '${edited__text}' WHERE book_id = '${id}'`,
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error updating book:", error);
    res.redirect("/"); // Redirect even if there's an error
  }
});

app.post("/delete", async (req, res) => {
  const book_id = req.body.submit;
  try {
    await db.query(`DELETE FROM book where book_id = '${book_id}'`);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting book:", error);
    res.redirect("/"); // Redirect even if there's an error
  }
});

app.post("/add", async (req, res) => {
  const { name, year, author, id, summary, quote, review, rating, pdf, buy } = req.body;

  // book_id(id), pdf link and buy links aren't necessary
  if (name && year && author && summary && quote && review && rating) {
    try {
      await db.query(`INSERT INTO book (
    name,
    year,
    author,
    book_id,
    summary,
    quote,
    review,
    rating,
    pdf,
    buy
  )
VALUES (
    '${name}',
    ${year},
    '${author}',
    '${id}',
    '${summary}',
    '${quote}',
    '${review}',
    '${rating}',
    '${pdf}',
    '${buy}'
  );`);
      res.redirect("/");
    } catch (error) {
      console.error("Error adding book:", error);
      res.redirect("/"); // Redirect even if there's an error
    }
  } else {
    res.redirect("/");
  }
});

app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});

// TODO: some sort of waiting sign when searching for books
//blend bgc of the delete button better

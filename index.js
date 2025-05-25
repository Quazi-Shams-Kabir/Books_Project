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
  database: "books_project_27cv_6p2d",
  port: 5432,
  host: "dpg-d0olroje5dus73d0b8pg-a.singapore-postgres.render.com",
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
    const query = `UPDATE book SET review = $1 WHERE book_id = $2`;
    const values = [edited__text, id];

    await db.query(query, values);
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
  const { name, year, author, summary, quote, review, rating, pdf, buy } = req.body;
  let book_id=req.body.id;
  let id;
  if (book_id){
    id = book_id
  } else {
    id = name+author;
  }

// pdf link buy link and book_id isn't must, although book_id will be there for
// updating purpose
if (name && year && author && summary && quote && review && rating) {
  try {
    const query = `
      INSERT INTO book (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const values = [
      name,
      year,
      author,
      id,
      summary,
      quote,
      review,
      rating,
      pdf,
      buy
    ];

    await db.query(query, values);
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

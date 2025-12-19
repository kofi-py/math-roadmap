import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET all questions
app.get("/api/questions", (req, res) => {
  db.all(
    "SELECT * FROM questions ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// POST a question
app.post("/api/questions", (req, res) => {
  const { title, body, tags } = req.body;

  db.run(
    "INSERT INTO questions (title, body, tags) VALUES (?, ?, ?)",
    [title, body, tags],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// VOTE
app.patch("/api/questions/:id", (req, res) => {
  const { votes } = req.body;

  db.run(
    "UPDATE questions SET votes = ? WHERE id = ?",
    [votes, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.listen(PORT, () => {
  console.log(`math forum backend running on port ${PORT}`);
});


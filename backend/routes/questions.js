const express = require("express");
const db = require("../db");

const router = express.Router();

/* SAVE QUESTION */
router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "missing fields" });
  }

  db.run(
    "INSERT INTO questions (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        title,
        content
      });
    }
  );
});

/* GET QUESTIONS */
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM questions ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// mark an answer as accepted
router.patch("/:id/accept", (req, res) => {
  const questionId = req.params.id;
  const { answerId } = req.body;

  db.run(
    "UPDATE questions SET accepted_answer_id = ? WHERE id = ?",
    [answerId, questionId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});


module.exports = router;

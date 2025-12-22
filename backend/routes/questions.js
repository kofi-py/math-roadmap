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
    "INSERT INTO questions (title, body) VALUES (?, ?)",
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


/* GET SINGLE QUESTION */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM questions WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(row);
  });
});

/* GET ANSWERS FOR A QUESTION */
router.get("/:id/answers", (req, res) => {
  const { id } = req.params;
  db.all(
    "SELECT * FROM answers WHERE question_id = ? ORDER BY created_at ASC",
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

/* POST ANSWER FOR A QUESTION */
router.post("/:id/answers", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "missing content" });
  }

  db.run(
    "INSERT INTO answers (question_id, body) VALUES (?, ?)",
    [id, content],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        question_id: id,
        body: content,
        created_at: new Date()
      });
    }
  );
});

module.exports = router;

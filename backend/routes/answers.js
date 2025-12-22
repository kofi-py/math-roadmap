const express = require("express");
const db = require("../db");

const router = express.Router();

/* SAVE ANSWER */
router.post("/", (req, res) => {
  const { question_id, content } = req.body;

  if (!question_id || !content) {
    return res.status(400).json({ error: "missing fields" });
  }

  db.run(
    "INSERT INTO answers (question_id, body) VALUES (?, ?)",
    [question_id, content],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        question_id,
        content
      });
    }
  );
});

/* GET ANSWERS FOR A QUESTION */
router.get("/:questionId", (req, res) => {
  const { questionId } = req.params;

  db.all(
    "SELECT * FROM answers WHERE question_id = ? ORDER BY created_at ASC",
    [questionId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;

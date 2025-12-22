const express = require("express");
const db = require("../db");

const router = express.Router();

/* SAVE ANSWER */
router.post("/", async (req, res) => {
  const { question_id, content } = req.body;

  if (!question_id || !content) {
    return res.status(400).json({ error: "missing fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO answers (question_id, body) VALUES ($1, $2) RETURNING *",
      [question_id, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET ANSWERS FOR A QUESTION (Legacy route, covered in questions.js but kept if utilized) */
router.get("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM answers WHERE question_id = $1 ORDER BY created_at ASC",
      [questionId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

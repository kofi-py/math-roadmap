const express = require("express");
const db = require("../db");

const router = express.Router();

/* SAVE QUESTION */
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "missing fields" });
  }

  try {
    const result = await db.query(
      "INSERT INTO questions (title, body) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET QUESTIONS */
router.get("/", async (req, res) => {
  try {
    constresult = await db.query("SELECT * FROM questions ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET SINGLE QUESTION */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM questions WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET ANSWERS FOR A QUESTION */
router.get("/:id/answers", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM answers WHERE question_id = $1 ORDER BY created_at ASC",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST ANSWER FOR A QUESTION */
router.post("/:id/answers", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "missing content" });
  }

  try {
    const result = await db.query(
      "INSERT INTO answers (question_id, body) VALUES ($1, $2) RETURNING *",
      [id, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// mark an answer as accepted
router.patch("/:id/accept", async (req, res) => {
  const questionId = req.params.id;
  const { answerId } = req.body;

  try {
    await db.query(
      "UPDATE questions SET accepted_answer_id = $1 WHERE id = $2",
      [answerId, questionId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

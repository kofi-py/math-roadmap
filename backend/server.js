const express = require("express");
const cors = require("cors");

const questionRoutes = require("./routes/questions");
const answerRoutes = require("./routes/answers");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  console.log("backend alive");
});

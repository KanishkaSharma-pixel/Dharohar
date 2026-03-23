require("dotenv").config();
const axios = require("axios");


const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/cultures", (req, res) => {
  res.json([
    { name: "Warli", state: "Maharashtra" },
    { name: "Madhubani", state: "Bihar" },
    { name: "Kathakali", state: "Kerala" }
  ]);
});

app.post("/ask-ai", async (req, res) => {
  const question = req.body.question;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        inputs: `You are an expert on Indian culture. Answer this: ${question}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`
        }
      }
    );
    console.log("HF RESPONSE:", response.data);
    res.json({
      answer: response.data[0].generated_text
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "AI failed" });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
   
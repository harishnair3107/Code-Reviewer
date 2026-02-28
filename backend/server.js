const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { apiKey, code, language } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Analyze this ${language} code.
    Return JSON with:
    - time_complexity
    - space_complexity
    - issues (array)
    - suggestions (array)
    - optimized_code

    Code:
    ${code}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.json({ success: true, data: response });

  } catch (error) {
    res.status(500).json({ success: false, error: "Invalid API Key or AI error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));